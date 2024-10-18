// TODO:
// we need import export functionality
// also we need to implement RSA Enc and Dec
//
// Probably importing the pgp pub priv keys
// also maybe importing the symmetric data
// also we need to have importing the whole
// asymmetric data with:
// 1. encrypted passphrase
// 2. encrypted data
// 3. signature
//

// maybe create the documented steps
// or the visual look of the importing and exporting
// on the website of the MindLockr
//
// so first prompt the user first
// to click on the button that will initialize
// the folder called imported
//
// then user saves the file with supported file extensions
// we will tell the user whta are all of the supported file extensions
// than we are taking that file prompting the user with the folder name
// where he want to store in pgp folder
// then when the imported key is saved in the pgp folder / folderName
// we can remove the imported key from the folder and clean up the metadata

// for exporting just to perform export of the key

// Import keys UI:
//
// File Upload Component:
//
//     Drag-and-drop area or file selector for uploading key files.
//
// Paste Key Text:
//
//     Optionally, allow users to paste key text directly into a textarea.
//
// Import Button:
//
//     Trigger the import process.
//
//

//  Export Keys UI
//
//     Key Selection:
//         List available keys with checkboxes for selection.
//
//     Export Options:
//         Options to export public key, private key, or both.
//         Format selection (ASCII-armored or binary).
//
//     Download Links:
//         Generate download buttons for the selected keys.

export default function KeysIE() {
  return <div>IE</div>;
}
