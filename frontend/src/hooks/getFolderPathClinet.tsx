export const getFolderPathClientHook = () => {
  try {
    return localStorage.getItem("folderPath");
  } catch (error) {
    console.log("error occured in hook getFolderPathClient: ", error);
  }
};
