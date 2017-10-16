function ready(cb) {
    /in/.test(document.readyState)
        ? setTimeout(ready.bind(null, cb), 90)
        : cb();
};

ready(function () {

    var App = {
        "init": function () {
            this._applicationDbContext = ApplicationDbContext; // Reference to the ApplicationDbContext object
            this._applicationDbContext.init('ahs.nmd.stickynotes'); // Intialize the ApplicationDbContext with the connection string as parameter value
            this.testApplicationDbContext(); // Test DbContext
        },
        "testApplicationDbContext": function () {
            //
            // GetStickyNotes
            //
            // 1. Get all the StickyNotes, if empty, display a message. Wrap buttons in form-element so the page refreshes automatically.  
            let stickyNotes = this._applicationDbContext.getStickyNotes();
            var stickynoteElement = document.querySelector('.stickynote');
            if (stickyNotes === null) {
                stickynoteElement.innerHTML += "Geen sticky notes :( ";
            }
            else {
                stickyNotes.forEach(function (element) {
                    console.log(element);
                    stickynoteElement.innerHTML +=
                        `
                        <div class="col s12 m12 l6">
                            <div class="card blue-grey darken-1">
                                <div class="card-content white-text">
                                    <span class="card-title">${element.message}</span>
                                    <p>With ID : ${element.id}</p>
                                    <p>Modified : ${element.modifiedDate}</p>
                                    <p>Deleted : ${element.deletedDate}</p>
                                    <form>
                                        <button class="waves-effect waves-light btn red deleteSticky" id="${element.id}">Remove</button> 
                                        ${element.deletedDate === null ? `<button class="waves-effect waves-light btn red softDeleteSticky" id="${element.id}">SoftDelete</button>`
                            : `<button class="waves-effect waves-light btn red softUnDeleteSticky" id="${element.id}">SoftUnDelete</button>`}
                                        <button class="waves-effect waves-light btn blue updateSticky" id="${element.id}" data="${element.message}">Update</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    `;
                }, this);
            }
            //
            // AddStickyNote
            //
            // 1. Get the dom element and add an eventlistener.
            document.getElementById("createStickyNote").addEventListener("click", createStickyNote);
            // 2. Get the string from the interface and create a new StickyNote with it, if the string empty, display a message.
            function createStickyNote() {
                let value = document.getElementById("createStickyNoteValue").value;
                if (value === "" || value === null) {
                    window.alert("Please enter a correct sticky message.")
                }
                else {
                    let newSticky = new StickyNote();
                    newSticky.message = value;
                    ApplicationDbContext.addStickyNote(newSticky);
                }

            }
            //
            // DeleteStickyNote 
            //
            // 1. Get the dom element and add multiple eventlisteners.
            var deleteSticky = document.querySelectorAll('.deleteSticky');
            for (var i = 0; i < deleteSticky.length; i++) {
                deleteSticky[i].addEventListener('click', function (event) {
                    // 2. Ask the user if he wants to delete the StickyNote, if so delete it.
                    if (!confirm("Are you sure you want to delete " + this.id)) {
                        event.preventDefault();
                    }
                    var id = parseInt(this.id);
                    const deleted = ApplicationDbContext.deleteStickyNoteById(id);
                });
            }
            //
            // SoftDeleteStickyNoteById
            //
            // 1. Get the dom element and add multiple eventlisteners.
            var softDeleteSticky = document.querySelectorAll('.softDeleteSticky');
            for (var i = 0; i < softDeleteSticky.length; i++) {
                softDeleteSticky[i].addEventListener('click', function (event) {
                    // 2. Ask the user if he wants to softdelete the StickyNote, if so softdelete it.
                    if (!confirm("Are you sure you want to softdelete " + this.id)) {
                        event.preventDefault();
                    }
                    var id = parseInt(this.id);
                    const deleted = ApplicationDbContext.softDeleteStickyNoteById(id);
                });
            }
            //
            // SoftUnDeleteStickyNoteById
            //
            // 1. Get the dom element and add multiple eventlisteners.
            var softUnDeleteSticky = document.querySelectorAll('.softUnDeleteSticky');
            for (var i = 0; i < softUnDeleteSticky.length; i++) {
                softUnDeleteSticky[i].addEventListener('click', function (event) {
                    // 2. Ask the user if he wants to softundelete the StickyNote, if so softundelete it.
                    if (!confirm("Are you sure you want to softUndelete " + this.id)) {
                        event.preventDefault();
                    }
                    var id = parseInt(this.id);
                    const deleted = ApplicationDbContext.softUnDeleteStickyNoteById(id);
                });
            }
            //
            // UpdateStickyNoteById
            //
            // 1. Get the dom element and add multiple eventlisteners.
            var updateSticky = document.querySelectorAll('.updateSticky');
            for (var i = 0; i < updateSticky.length; i++) {
                updateSticky[i].addEventListener('click', function (event) {
                    // 2. Ask the user to enter a new message. If the message is empty, display a message.
                    let message = prompt("Please enter a message", "Dit is een geüpdate sticky");
                    if (message === null || message === "") {
                        window.alert("Please enter a valid message.")
                    }
                    else {
                        var id = parseInt(this.id);
                        sn = ApplicationDbContext.getStickyNoteById(id);
                        sn.message = message;
                        const updated = ApplicationDbContext.updateStickyNote(sn);
                    }
                });
            }

            /* // 1. Get all sticky notes
            let data = this._applicationDbContext.getStickyNotes();
            console.log(data);
            // 2. Create a new sticky note
            let sn = new StickyNote();
            sn.message = 'Pak cola zero voor jou.';
            sn = this._applicationDbContext.addStickyNote(sn); // add to db and save it
            // 3. Get allesticky notes
            data = this._applicationDbContext.getStickyNotes();
            console.log(data);
            // 4. Get sticky note by id
            sn = this._applicationDbContext.getStickyNoteById(2306155430445);
            console.log(sn);
            // 5. Delete sticky note by id
            const deleted = this._applicationDbContext.deleteStickyNoteById(2306155430445);
            console.log(deleted);
            // 6. Soft Delete sticky note with id: 1551637732407
            //const softDeleted = this._applicationDbContext.softDeleteStickyNoteById(1551637732407);
            //console.log(softDeleted);
            //sn = this._applicationDbContext.getStickyNoteById(1551637732407);
            //console.log(sn);
            // 6. Soft Delete sticky note with id: 1551637732407
            const softUnDeleted = this._applicationDbContext.softUnDeleteStickyNoteById(1551637732407);
            console.log(softUnDeleted);
            sn = this._applicationDbContext.getStickyNoteById(1551637732407);
            console.log(sn);
            // Update sticky note with id: 2824291866013
            //sn = this._applicationDbContext.getStickyNoteById(2824291866013);
            //console.log(sn);
            //sn.message = 'ik heb zin in een zwarte kat (koffie)...';
            const updated = this._applicationDbContext.updateStickyNote(2824291866013);
            console.log(updated);
            sn = this._applicationDbContext.getStickyNoteById(2824291866013);
            console.log(sn); */
        }
    };

    App.init(); // Initialize the application
});