const FormatDate = (date:Date):string => {
  const d = new Date(date);

  return d.toLocaleDateString();
}

export default FormatDate;