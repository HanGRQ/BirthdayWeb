export const calculateDaysAlive = (birthDate) => {
    const today = new Date();
    const timeDiff = today.getTime() - birthDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };