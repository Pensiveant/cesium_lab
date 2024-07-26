function wrapLogMessage({ type = "info", title, message }) {
  let types = ["info", "error", "warning", "success"];
  let logStr = [message];
  let colors = {
    info: "#909399",
    error: "#F56C6C",
    warning: "#E6A23C",
    success: "#67C23A",
  };

  if (!title) {
    title = type;
  }

  if (types.includes(type.toLocaleLowerCase())) {
    let color = colors[type.toLocaleLowerCase()];
    logStr = [
      `%c ${title} %c ${message} %c`,
      `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      "background:blue",
    ];
  }

  return logStr;
}

export default wrapLogMessage;
