// customPlugin.js

// Wait for the DOM to be fully loaded
// document.addEventListener("DOMContentLoaded", function() {
//     CKEDITOR.on('instanceReady', function() {
//         // CKEditor is fully initialized, you can now use its functionalities
//         CKEDITOR.replace('editor'); // Replace 'editor' with the ID of your textarea element
        
//         // Add your custom plugin after CKEditor is initialized
//         CKEDITOR.plugins.add('customPlugin', {
//             icons: 'customPlugin',
//             init: function(editor) {
//                 editor.addCommand('insertDateTime', {
//                     exec: function(editor) {
//                         var currentDate = new Date();
//                         editor.insertHtml('Current Date & Time: ' + currentDate.toLocaleString());
//                     }
//                 });

//                 editor.ui.addButton('CustomPlugin', {
//                     label: 'Insert Date & Time',
//                     command: 'insertDateTime',
//                     toolbar: 'insert'
//                 });
//             }
//         });
//     });

//     // Load CKEditor script dynamically
//     var ckeditorScript = document.createElement('script');
//     ckeditorScript.src = 'path/to/ckeditor.js'; // Replace with the actual path to CKEditor script
//     document.head.appendChild(ckeditorScript);
// });




// CKEDITOR.plugins.add( 'timestamp', {
//     icons: 'timestamp',
//     init: function( editor ) {
//         editor.addCommand( 'insertTimestamp', {
//             exec: function( editor ) {
//                 var now = new Date();
//                 editor.insertHtml( 'The current date and time is: <em>' + now.toString() + '</em>' );
//             }
//         });
//         editor.ui.addButton( 'Timestamp', {
//             label: 'Insert Timestamp',
//             command: 'insertTimestamp',
//             toolbar: 'insert'
//         });
//     }
// });


// import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

// export default class TimestampPlugin extends Plugin {
//     init() {
//         const editor = this.editor;

//         editor.ui.componentFactory.add('timestamp', locale => {
//             const view = new ButtonView(locale);

//             view.set({
//                 label: 'Insert Timestamp',
//                 tooltip: true,
//                 icon: '<svg>...</svg>', // Add an appropriate icon here
//             });

//             view.on('execute', () => {
//                 const now = new Date();
//                 const timestamp = `<em>The current date and time is: ${now.toString()}</em>`;
//                 editor.model.change(writer => {
//                     writer.insertText(timestamp, editor.model.document.selection.getFirstPosition());
//                 });
//             });

//             return view;
//         });
//     }
// }

