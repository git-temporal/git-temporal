export const hasSearch = searchText => {
  return searchText && searchText.toString().trim() !== '';
};

export const matchesSearch = (testText, searchText) => {
  if (!hasSearch(searchText)) {
    return true;
  }
  if (!testText) {
    return false;
  }
  const realSearchText = searchText.toString().toLowerCase();
  return testText.toLowerCase().includes(realSearchText);
};

export const matchesAuthorSearch = (testText, searchText) => {
  return matchesSearch(
    testText,
    searchText.replace(/authors?\s*[\:\=]\s*/, '')
  );
};
export const matchesCommitSearch = (testText, searchText) => {
  return matchesSearch(
    testText,
    searchText.replace(/commits?\s*[\:\=]\s*/, '')
  );
};

export const fileSearchRegex = /files?\s*[\:\=]\s*/;

export const matchesFileSearch = (testText, searchText) => {
  return matchesSearch(testText, searchText.replace(fileSearchRegex, ''));
};

export const commitsMatchSearch = (commit, searchText) => {
  if (!hasSearch(searchText)) {
    return true;
  }
  const commits = !Array.isArray(commit) ? [commit] : commit;
  for (const commit of commits) {
    let matchesFileName = false;
    for (const file of commit.files) {
      matchesFileName = matchesFileSearch(file.name, searchText);
      if (matchesFileName) {
        break;
      }
    }
    if (
      matchesFileName ||
      matchesCommitSearch(commit.message, searchText) ||
      matchesCommitSearch(commit.id, searchText) ||
      matchesCommitSearch(commit.body, searchText) ||
      matchesAuthorSearch(commit.authorName, searchText) ||
      matchesAuthorSearch(commit.authorEmail, searchText)
    ) {
      return true;
    }
  }
  return false;
};
