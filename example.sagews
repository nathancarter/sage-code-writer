︠8c413489-5056-47e7-bfa6-d6615f6ba8d1a︠
%javascript
WEC = worksheet.execute_code; CME = worksheet.worksheet.editor.codemirror;
︡38a26f9a-ab78-424e-99a9-02d0b38a74bc︡{"javascript":{"code":"WEC = worksheet.execute_code; CME = worksheet.worksheet.editor.codemirror;\n"}}︡
︠8acfc441-d067-41ea-aaa4-5c925adee826︠
%load nocodeplease.sage modal.js nocodeplease.js

︡a0c51d4c-a9fb-43d8-acbf-4b9391556926︡{"once":false,"file":{"show":false,"uuid":"5912a1ab-9339-4390-9e84-3bd18e80c95e","filename":"modal.js"}}︡{"html":"<script src=\"/blobs/modal.js?uuid=5912a1ab-9339-4390-9e84-3bd18e80c95e\"></script>"}︡{"once":false,"file":{"show":false,"uuid":"88997144-fb33-443c-9301-18296f14939d","filename":"nocodeplease.js"}}︡{"html":"<script src=\"/blobs/nocodeplease.js?uuid=88997144-fb33-443c-9301-18296f14939d\"></script>"}︡
︠b56e5a0c-7b7a-4a09-9971-8a0988badcf9︠

# After you load this file, execute the top two cells.
# That should put a button on your toolbar that reads "No code, please."
# Click it to get started.

# Why is the first cell necessary?  Well, I wish it weren't.
# But I found that JavaScript loaded with %load couldn't see the worksheet object,
# so I had to first store the entries within it that I cared about in some global
# variables before loading *.js thereafter.  Thus the various *.js files have been
# written to reference WEC and CME, rather than the global worksheet variable.

# Why is the second cell necessary?  Well, I wish it weren't.
# One day it would be awesome if this project were so polished that it gets
# integrated into Sage itself, and thus an official button on the actual worksheet
# toolbar is added by the cloud interface itself, and the code from the .sage file
# is just part of Sage itself, so that the %load line is unimportant.
︠127249b6-638c-406e-8618-1e160c2d8abc︠










