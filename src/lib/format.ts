export const formatDate = (isoDate: string) => {
  const parsedDate = new Date(isoDate)
  if (Number.isNaN(parsedDate.getTime())) {
    return isoDate
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate)
}
