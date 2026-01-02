import chalk from 'chalk';

/**
 * bannerLogger
 * Pretty + JSON logger for Banner CRUD operations
 *
 * @param {Object} options
 *  - banner: Banner document (Mongoose)
 *  - index: Serial number (optional)
 *  - event: Event name (string)
 *  - mode: 'pretty' or 'json'
 *  - success: true/false
 */
const bannerLogger = ({
  banner,
  index = null,
  event = 'BANNER_EVENT',
  mode = 'pretty',
  success = undefined,
}) => {
  const time = new Date().toLocaleString('en-BD', {
    timeZone: 'Asia/Dhaka',
  });

  const payload = {
    id: banner?._id?.toString() ?? 'N/A',
    name: banner?.name ?? 'N/A',
    title: banner?.title ?? 'N/A',
    description: banner?.description ?? 'N/A',
    image: banner?.image ?? 'No image',
    bannerType: banner?.bannerType ?? 'General',
    priority: banner?.priority ?? 0,
    link: banner?.link ?? 'N/A',
    tags: banner?.tags?.length ? banner.tags.join(', ') : 'None',
    isActive: banner?.isActive ?? false,
    startFrom: banner?.startFrom
      ? new Date(banner.startFrom).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    endAt: banner?.endAt
      ? new Date(banner.endAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    createdAt: banner?.createdAt
      ? new Date(banner.createdAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    updatedAt: banner?.updatedAt
      ? new Date(banner.updatedAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    time,
    ...(success !== undefined && { success }),
    ...(index !== null && { index }),
  };

  // 🧾 JSON mode (for logs / files)
  if (mode === 'json') {
    console.log(JSON.stringify({ event, ...payload }, null, 2));
    return;
  }

  // 🎨 Pretty console output
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chalk.green(`🖼️  ${event}`)}
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
${chalk.cyan('🆔 ID        :')} ${chalk.green(payload.id)}
${chalk.cyan('🏷 Name      :')} ${chalk.blue(payload.name)}
${chalk.cyan('📰 Title     :')} ${chalk.magenta(payload.title)}
${chalk.cyan('📝 Desc      :')} ${chalk.yellow(payload.description)}
${chalk.cyan('🖼 Image     :')} ${payload.image}
${chalk.cyan('🎯 Type      :')} ${chalk.magenta(payload.bannerType)}
${chalk.cyan('⭐ Priority  :')} ${chalk.yellow(payload.priority)}
${chalk.cyan('🔗 Link      :')} ${chalk.blue(payload.link)}
${chalk.cyan('🏷 Tags      :')} ${chalk.yellow(payload.tags)}
${chalk.cyan('✔ Active    :')} ${payload.isActive}
${chalk.cyan('⏳ Start     :')} ${chalk.yellow(payload.startFrom)}
${chalk.cyan('⌛ End       :')} ${chalk.yellow(payload.endAt)}
${chalk.cyan('🕒 Created  :')} ${chalk.yellow(payload.createdAt)}
${chalk.cyan('🛠 Updated  :')} ${chalk.yellow(payload.updatedAt)}
${chalk.cyan('⏱ Log Time :')} ${chalk.yellow(payload.time)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
};

export { bannerLogger };

