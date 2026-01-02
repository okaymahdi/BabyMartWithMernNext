import chalk from 'chalk';

/**
 * categoryLogger
 * Pretty + JSON logger for Category CRUD operations
 *
 * @param {Object} options
 *  - category: Category document (Mongoose)
 *  - index: Serial number (optional)
 *  - event: Event name (string)
 *  - mode: 'pretty' or 'json'
 *  - success: true/false
 */
const categoryLogger = ({
  category,
  index = null,
  event = 'CATEGORY_EVENT',
  mode = 'pretty',
  success = undefined,
}) => {
  const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

  const payload = {
    id: category?._id?.toString() ?? 'N/A',
    name: category?.name ?? 'N/A',
    slug: category?.slug ?? 'N/A',
    description: category?.description ?? 'N/A',
    image: category?.image ?? 'No image',
    categoryType: category?.categoryType ?? 'General',
    isActive: category?.isActive ?? false,
    createdAt: category?.createdAt
      ? new Date(category.createdAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    updatedAt: category?.updatedAt
      ? new Date(category.updatedAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    time,
    ...(success !== undefined && { success }),
    ...(index !== null && { index }),
  };

  // JSON mode
  if (mode === 'json') {
    console.log(JSON.stringify({ event, ...payload }, null, 2));
    return;
  }

  // Pretty console log
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chalk.green(`✅ ${event}`)}
${
  payload.success !== undefined
    ? chalk.cyan('✔ Success :') + ' ' + chalk.green(payload.success)
    : ''
}
${
  index !== null
    ? chalk.cyan('🔢 Index   :') + ' ' + chalk.yellow(payload.index)
    : ''
}
${chalk.cyan('🆔 ID       :')} ${chalk.green(payload.id)}
${chalk.cyan('🏷 Name    :')} ${chalk.blue(payload.name)}
${chalk.cyan('📝 Slug    :')} ${chalk.yellow(payload.slug)}
${chalk.cyan('📝 Description :')} ${chalk.yellow(payload.description)}
${chalk.cyan('🖼 Image   :')} ${payload.image}
${chalk.cyan('🎯 Type    :')} ${chalk.magenta(payload.categoryType)}
${chalk.cyan('✔ Active  :')} ${payload.isActive}
${chalk.cyan('🕒 Created :')} ${chalk.yellow(payload.createdAt)}
${chalk.cyan('🛠 Updated :')} ${chalk.yellow(payload.updatedAt)}
${chalk.cyan('⏱ Log Time:')} ${chalk.yellow(payload.time)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
};

export { categoryLogger };
