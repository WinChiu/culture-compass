export const applyFilters = (data, filters) => {
  if (!data) return [];

  return data.filter((row) => {
    if (filters.ageRange) {
      const age = parseInt(row.age, 10);
      if (
        isNaN(age) ||
        age < 0 ||
        age < filters.ageRange[0] ||
        age > filters.ageRange[1]
      ) {
        return false;
      }
    }

    if (filters.sex && filters.sex !== 0) {
      if (row.sex !== String(filters.sex)) return false;
    }

    if (filters.country && filters.country !== "ALL") {
      if (row.countryCode !== filters.country) return false;
    }

    if (filters.maritalStatus && filters.maritalStatus.length > 0) {
      if (!filters.maritalStatus.includes(Number(row.maritalStatus))) {
        return false;
      }
    }

    if (filters.eduLevelW8 && filters.eduLevelW8.length > 0) {
      if (
        !filters.eduLevelW8.includes(Number(row.eduLevelW8)) &&
        row.eduLevelW8 != -4
      ) {
        return false;
      }
    }

    if (filters.employmentStatus && filters.employmentStatus.length > 0) {
      if (!filters.employmentStatus.includes(Number(row.employmentStatus))) {
        return false;
      }
    }

    return true;
  });
};
