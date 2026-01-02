import chalk from 'chalk';

const productLogger = ({
  product,
  index = null, // serial number (optional)
  event = 'PRODUCT_EVENT',
  mode = 'pretty', // 'pretty' or 'json'
  success = undefined,
}) => {
  const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

  // 1️⃣ Prepare images array safely
  const images = product?.images?.length ? product.images : ['No images'];

  // 2️⃣ Prepare reviews safely
  const reviews =
    product?.reviews?.map((r, i) => ({
      index: i + 1,
      user: r.user?.toString() ?? 'N/A',
      rating: r.rating ?? 'N/A',
      comment: r.comment ?? 'N/A',
      createdAt: r.createdAt
        ? new Date(r.createdAt).toLocaleString('en-BD', {
            timeZone: 'Asia/Dhaka',
          })
        : 'N/A',
    })) || [];

  // 3️⃣ Payload
  const payload = {
    id: product?._id?.toString() ?? 'N/A',
    name: product?.name ?? 'N/A',
    description: product?.description ?? 'N/A',
    price: product?.price ?? 0,
    discountPercentage: product?.discountPercentage ?? 0,
    discountedPrice: product?.price
      ? product.price -
        (product.price * (product.discountPercentage ?? 0)) / 100
      : 0,
    stock: product?.stock ?? 0,
    averageRating: product?.averageRating ?? 0,
    category: product?.category?.toString() ?? 'N/A',
    brand: product?.brand?.toString() ?? 'N/A',
    images,
    reviews,
    tags: product?.tags ?? [],
    isFeatured: product?.isFeatured ?? false,
    SKU: product?.SKU ?? 'N/A',
    status: product?.status ?? 'available',
    createdAt: product?.createdAt
      ? new Date(product.createdAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    updatedAt: product?.updatedAt
      ? new Date(product.updatedAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    time,
    ...(success !== undefined && { success }),
  };

  // 4️⃣ JSON mode
  if (mode === 'json') {
    console.log(JSON.stringify({ event, ...payload }, null, 2));
    return;
  }

  // 5️⃣ Pretty console log
  const reviewsLog =
    reviews.length === 0
      ? '  No reviews'
      : '[\n' +
        reviews
          .map(
            (r) => `  🔹 [#${r.index}]
    🆔 User    : ${r.user}
    ⭐ Rating  : ${r.rating}
    💬 Comment : ${r.comment}
    🕒 Created : ${r.createdAt}`,
          )
          .join('\n') +
        '\n]';

  const imagesLog =
    images.length === 0
      ? '  No images'
      : '[\n' +
        images.map((img, i) => `  [${i + 1}] ${img}`).join('\n') +
        '\n]';

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chalk.green(`✅ ${event}`)}
${
  payload.success !== undefined
    ? chalk.cyan('✔ Success     :') + ' ' + chalk.green(payload.success)
    : ''
}
${chalk.cyan('🆔 ID          :')} ${chalk.green(payload.id)}
${chalk.cyan('🛍 Name        :')} ${chalk.blue(payload.name)}
${chalk.cyan('📝 Description :')} ${chalk.yellow(payload.description)}
${chalk.cyan('💲 Price       :')} ${chalk.green(payload.price)}
${chalk.cyan('💸 Discount %  :')} ${chalk.magenta(payload.discountPercentage)}
${chalk.cyan('💰 Discounted  :')} ${chalk.cyan(payload.discountedPrice)}
${chalk.cyan('📦 Stock       :')} ${chalk.green(payload.stock)}
${chalk.cyan('⭐ Avg Rating  :')} ${chalk.yellow(payload.averageRating)}
${chalk.cyan('🏷 Tags       :')} ${payload.tags.join(', ') || 'N/A'}
${chalk.cyan('🏷 Category   :')} ${chalk.blue(payload.category)}
${chalk.cyan('🏷 Brand      :')} ${chalk.blue(payload.brand)}
${chalk.cyan('🖼 Images     :')} ${imagesLog}
${chalk.cyan('📝 Reviews    :')} ${reviewsLog}
${chalk.cyan('🎯 Featured   :')} ${payload.isFeatured}
${chalk.cyan('🔖 SKU        :')} ${payload.SKU}
${chalk.cyan('📌 Status     :')} ${payload.status}
${chalk.cyan('🕒 Created    :')} ${chalk.yellow(payload.createdAt)}
${chalk.cyan('🛠 Updated    :')} ${chalk.yellow(payload.updatedAt)}
${chalk.cyan('⏱ Log Time   :')} ${chalk.yellow(payload.time)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
};

export { productLogger };
