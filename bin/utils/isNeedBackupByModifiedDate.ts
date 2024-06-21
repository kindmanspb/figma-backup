const isNeedBackupByModifiedDate = (date: string, hoursToGetOld = 0) => {
  const dateModified = Date.parse(date);

  if (isNaN(dateModified)) {
    console.log("Дата не распознана " + date);
    return false;
  }

  const lastDateToModify = new Date();
  lastDateToModify.setHours(lastDateToModify.getHours() - hoursToGetOld);
  const lastTimeToModify = lastDateToModify.getTime();

  return dateModified < lastTimeToModify;
};

export default isNeedBackupByModifiedDate;