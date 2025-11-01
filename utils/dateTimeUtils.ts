export const formatToLocalDateTime = (dateStr: string, timeStr?: string): string => {
  if (!dateStr) return '';
  
  let finalTimeStr = timeStr;
  if (!finalTimeStr) {
    const now = new Date();
    finalTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  
  return `${dateStr}T${finalTimeStr}:00`;
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const getCurrentTime = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

export const parseLocalDateTime = (localDateTime: string): { date: string; time: string } => {
  if (!localDateTime) return { date: '', time: '' };
  
  const [datePart, timePart] = localDateTime.split('T');
  const timeOnly = timePart ? timePart.slice(0, 5) : '';
  
  return {
    date: datePart || '',
    time: timeOnly
  };
};


export const isValidDate = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidTime = (timeStr: string): boolean => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeStr);
};

export const isValidLocalDateTime = (dateTimeStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if (!regex.test(dateTimeStr)) return false;
  
  const date = new Date(dateTimeStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const dateToLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};