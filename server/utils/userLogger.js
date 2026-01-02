import chalk from 'chalk';

// User Logger function
const userLogger = ({
  user,
  index = null, // User serial number (optional)
  event = 'USER_EVENT', // Event name
  mode = 'pretty', // 'pretty' or 'json'
  success = undefined, // success value from controller
}) => {
  const time = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka' });

  // 1️⃣ Prepare addresses array safely
  const addresses =
    user?.addresses?.map((addr) => ({
      street: addr.street ?? 'N/A',
      city: addr.city ?? 'N/A',
      state: addr.state ?? 'N/A',
      country: addr.country ?? 'N/A',
      postalCode: addr.postalCode ?? 'N/A',
      isDefault: addr.isDefault ?? false,
    })) || [];

  // 2️⃣ Payload for logging
  const payload = {
    id: user?._id?.toString() ?? 'N/A',
    name: user?.name ?? 'N/A',
    email: user?.email ?? 'N/A',
    gender: user?.gender ?? 'N/A', // ✅ added gender field
    password:
      process.env.NODE_ENV === 'development'
        ? user?.password ?? 'N/A'
        : '[HIDDEN]',
    role: user?.role ?? 'N/A',
    avatar: user?.avatar || '',
    addresses,
    createdAt: user?.createdAt
      ? new Date(user.createdAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    updatedAt: user?.updatedAt
      ? new Date(user.updatedAt).toLocaleString('en-BD', {
          timeZone: 'Asia/Dhaka',
        })
      : 'N/A',
    time,
    ...(success !== undefined && { success }),
  };

  // 3️⃣ Gender Emoji based on gender
  const genderEmoji =
    payload.gender === 'female'
      ? '👩' // Female emoji
      : payload.gender === 'male'
      ? '👨' // Male emoji
      : '🧑'; // Default (Non-binary)

  // 4️⃣ Avatar Value (if empty fallback to 'N/A')
  const avatarValue =
    payload.avatar && payload.avatar !== '' ? payload.avatar : 'N/A';

  // 5️⃣ Prepare addresses log
  const addressesLog =
    addresses.length === 0
      ? '  No addresses' // If no addresses
      : '[\n' + // addresses exists => wrap with []
        addresses
          .map(
            (addr, addrIndex) => `  🏘 [${addrIndex + 1}]
    🛣 Street     : ${addr.street}
    🌆 City       : ${addr.city}
    🏙️ State      : ${addr.state}
    🌏 Country    : ${addr.country}
    📮 PostalCode : ${addr.postalCode}
    ⭐ Default    : ${addr.isDefault}`,
          )
          .join('\n') + // Each address on a new line
        '\n]'; // Close the address array

  // 6️⃣ Pretty Console log
  if (mode === 'pretty') {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${chalk.green(`✅ ${event}`)}
${
  payload.success !== undefined
    ? chalk.cyan('✔ Success     :') + ' ' + chalk.green(payload.success)
    : ''
}
${chalk.cyan('👤 User Info   :')}${
      index !== null ? chalk.bgBlue(`[#${index + 1}]`) : ''
    }
${chalk.cyan('🆔 ID          :')} ${chalk.green(payload.id)}
${chalk.cyan('🧑 Gender      :')} ${chalk.yellow(
      `${genderEmoji} ${payload.gender}`,
    )}
${chalk.cyan('🧑 Name        :')} ${chalk.blue(payload.name)}
${chalk.cyan('📧 Email       :')} ${chalk.magenta(payload.email)}
${chalk.cyan('🔒 Password    :')} ${chalk.gray(payload.password)}
${chalk.cyan('🖼 Avatar URL  :')} ${chalk.yellow(avatarValue)}
${chalk.cyan('🏡 Addresses   :')} ${addressesLog}

${chalk.cyan('👑 Role        :')} ${chalk.redBright(payload.role)}
${chalk.cyan('🕒 Created     :')} ${chalk.yellow(payload.createdAt)}
${chalk.cyan('🛠 Updated     :')} ${chalk.yellow(payload.updatedAt)}
${chalk.cyan('⏱ Log Time    :')} ${chalk.yellow(payload.time)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }

  // 7️⃣ JSON Mode (for API or structured logs)
  if (mode === 'json') {
    console.log(JSON.stringify({ event, ...payload }, null, 2));
  }
};

export { userLogger };
