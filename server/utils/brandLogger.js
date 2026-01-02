import chalk from 'chalk';

const brandLogger = ({
  brand,
  index = null, // serial number (optional)
  event = 'BRAND_EVENT',
  mode = 'pretty', // 'pretty' | 'json'
  success = undefined,
}) => {
  const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

  // 1️⃣ Safe image
  const image = brand?.image ?? 'No image';

  // 2️⃣ Payload
  const payload = {
    id: brand?._id?.toString() ?? 'N/A',
    name: brand?.name ?? 'N/A',
    slug: brand?.slug ?? 'N/A',
    image,
    isActive: brand?.isActive ?? true,
    createdAt: brand?.createdAt
      ? new Date(brand.createdAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    updatedAt: brand?.updatedAt
      ? new Date(brand.updatedAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    time,
    ...(success !== undefined && { success }),
  };

  // 3️⃣ JSON mode
  if (mode === 'json') {
    console.log(JSON.stringify({ event, ...payload }, null, 2));
    return;
  }

  // 4️⃣ Pretty console log
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chalk.green(`🏷️  ${event}`)}
${
  payload.success !== undefined
    ? chalk.cyan('✔ Success     :') + ' ' + chalk.green(payload.success)
    : ''
}
${index !== null ? chalk.cyan('🔢 Index      :') + ' ' + index : ''}
${chalk.cyan('🆔 ID         :')} ${chalk.green(payload.id)}
${chalk.cyan('🏷 Name       :')} ${chalk.blue(payload.name)}
${chalk.cyan('🔗 Slug       :')} ${chalk.magenta(payload.slug)}
${chalk.cyan('🖼 Image      :')} ${chalk.yellow(payload.image)}
${chalk.cyan('✅ Active     :')} ${chalk.green(payload.isActive)}
${chalk.cyan('🕒 Created   :')} ${chalk.yellow(payload.createdAt)}
${chalk.cyan('🛠 Updated   :')} ${chalk.yellow(payload.updatedAt)}
${chalk.cyan('⏱ Log Time  :')} ${chalk.yellow(payload.time)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
};

export { brandLogger };
