//////////////////////////////////////// FORM VALIDATION //////////////////////////////////////// 

// Form validation
const validate = () => {
    'use strict'; 
    
    const forms = $(".needs-validation");
    
    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            } else {
                form.classList.add("is-valid");
            }

            form.classList.add("was-validated")
        }, false);
    });
}

validate();

//////////////////////////////////////// TOOLTIPS, BUTTON BLUR, PRE-LOADER //////////////////////////////////////// 

$(window).on('load', () => {
    // Pre-loader
    if ($("#preloader").length) {
        $("#preloader").delay(1000).fadeOut('slow', () => {
            $(this).remove();
        });
    }

    // Go back to current tab on reload
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', e => {
        localStorage.setItem('activeTab', $(e.target).attr('id'));
    });

    let activeTab = localStorage.getItem('activeTab');

    if (activeTab) {
        $(`#${activeTab}`).tab('show');
    }
});

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

$("#add-data").on('show.bs.modal', () => {
    $(".tooltips").tooltip()
});

const stopButtonBlur = (modalID, buttonClass) => {
    $(`#${modalID}`).on('shown.bs.modal', function() {
        $(`.${buttonClass}`).one('focus', function(e) {
            $(this).blur();
        });
    });
}

$('#search-btn').on('click', function() {
    $(this).blur();
});

//////////////////////////////////////// CONTENT CARDS //////////////////////////////////////// 

const personnelContentCard = (id, fname, lname, email, department, location) => {
    const html = `
    <div class="hide-personnel-container flex-basis p-2 mt-2 border border-2 rounded rounded-3">
        <div class="row align-items-center">
            <div class="col-auto me-auto">
                <p class="card-content fw-bold">${lname}, ${fname}</p>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-warning edit-personnel" data-bs-toggle="modal" data-bs-target="#edit-personnel-modal" aria-label="Edit personnel record ${id}" id="edit-personnel-${id}"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-danger delete-personnel" data-bs-toggle="modal" data-bs-target="#delete-personnel-modal" aria-label="Delete personnel record ${id}" id="edit-personnel-${id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col">
                <p class="card-content fst-italic">${email}</p>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col me-auto">
                <p class="card-content">${department}</p>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col">
                <p>${location}</p>
            </div>
        </div>
    </div>`;

    return html;
};

const departmentContentCard = (id, name, location) => {
    const html =`
    <div class="container hide-department-container flex-basis p-2 mt-2 border border-2 rounded rounded-3">
        <div class="row align-items-center pb-3">
            <div class="col-auto me-auto">
                <p class="card-content fw-bold add-department-id" id="add-department-id-${id}">${name}</p>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-warning edit-department" data-bs-toggle="modal" data-bs-target="#edit-department-modal" aria-label="Edit department record ${id}" id="edit-department-${id}"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-danger delete-department" aria-label="Delete department record ${id}" id="delete-department-${id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
        <div class="row align-items-center">
            <div class="col">
                <p class="card-content">${location}</p>
            </div>
        </div>
    </div>`;

    return html;
};

const locationContentCard = (id, name) => {
    const html = `
    <div class="container hide-location-container flex-basis p-2 mt-2 border border-2 rounded rounded-3">
        <div class="row align-items-center">
            <div class="col-auto me-auto">
                <p class="card-content card-content-location fw-bold section-title" id="add-location-${id}">${name}</p>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-warning edit-location" data-bs-toggle="modal" data-bs-target="#edit-location-modal" aria-label="Edit location record ${id}" id="edit-location-${id}"><i class="fa-solid fa-pen"></i></button>
                <button type="button" class="btn btn-danger delete-location" aria-label="Delete location record ${id}" id="delete-location-${id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    </div>`;
    
    return html;
};

//////////////////////////////////////// GET DATA ////////////////////////////////////////
window.onload = () => {

    $.ajax({
        url: "./public/php/getAll.php",
        dataType: "json",
        type: "GET",

        success: result => {
            if (result.status.name == "ok") {

                // Add Personnel to DOM
                Object.entries(result.data).forEach(element => {
                    const id = element[1]['id'];
                    const lastName = element[1]['lastName'];
                    const firstName = element[1]['firstName'];
                    const email = element[1]['email'];
                    const department = element[1]['department'];
                    const location = element[1]['location'];

                    $("#nav-personnel-content").append(personnelContentCard(id, firstName, lastName, email, department, location));                    
                });                
            }
        },
        
        error: (textStatus, errorThrown) => {
            console.log(`Error // textStatus: ${textStatus} // errorThrown: ${errorThrown}`);
        }
    });
    
    // Add Departments to DOM
    $.ajax({
        url: "./public/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",

        success: result => {
            if (result.status.name = "ok") {

                Object.entries(result.data).forEach(department => {

                    const departmentID = department[1]['id'];
                    const departmentName = department[1]['name'];
                    const departmentLocation = department[1]['location_name'];

                    // Add all departments to main content container
                    $("#nav-department-content").append(departmentContentCard(departmentID, departmentName, departmentLocation));
                    
                    // Add all Departments to Add Personnel modal form
                    $("#add-personnel-dept").append(`<option value="${departmentID}">${departmentName}</option>`);

                    // Add all Departments to Edit Personnel modal form
                    $("#edit-personnel-dept").append(`<option value="${departmentID}" id="edit-personnel-deptID-${departmentID}">${departmentName}</option>`);
                });
            }
        },

        error: (textStatus, errorThrown) => {
            console.log(`Error // textStatus: ${textStatus} // errorThrown: ${errorThrown}`);
        }
    });

    // Add Locations to DOM
    $.ajax({
        url: "./public/php/getAllLocations.php",
        type: "GET",
        dataType: "json",

        success: result => {
            if (result.status.name = "ok") {

                Object.entries(result.data).forEach(location => {

                    let locationID = location[1]['id'];
                    let locationName = location[1]['name'];

                    // Add all locations to main content container
                    $("#nav-location-content").append(locationContentCard(locationID, locationName));

                    // Add all locations to Add Department modal form
                    $("#add-department-location").append(`<option value="${locationID}">${locationName}</option>`);
                    
                    // Add all locations to Edit Department modal form
                    $("#edit-department-location").append(`<option value="${locationID}">${locationName}</option>`);
                });
            }
        },

        error: (textStatus, errorThrown) => {
            console.log(`Error // textStatus: ${textStatus} // errorThrown: ${errorThrown}`);
        }
    });
}

// Change ADD DATA tab/nav pill
const changeCurrentTab = (tab, addClass) => {
    $(`#${tab}`).on('click', () => {
        $("#current-modal").removeClass();
        $("#current-modal").addClass(`${addClass}`);
    });
}

changeCurrentTab("modal-personnel-tab", "submit-personnel");
changeCurrentTab("modal-department-tab", "submit-department");
changeCurrentTab("modal-location-tab", "submit-location");

stopButtonBlur('add-data', 'add-data');

//////////////////////////////////////// CREATE DATA ////////////////////////////////////////

document.querySelectorAll(".nav-pills>.nav-link").forEach(button => button.addEventListener("click", (e) => {
    // Remove .validate and required attributes
    document.querySelector("#add-data-form").querySelectorAll("input").forEach(input => {
        input.classList.remove("validate");
        input.required = false;
    });

    const id = e.target.id;

    // Add .validate and required based on id
    switch (id) {
        case "modal-location-tab": {
            document.getElementById("add-location-name").required = true;
            document.getElementById("add-location-name").classList.add("validate");
        };
        break;
        case "modal-department-tab": {
            document.getElementById("add-department-name").required = true;
            document.getElementById("add-department-name").classList.add("validate");
        };
        break;
        case "modal-personnel-tab": {
            document.getElementById("add-personnel-fname").required = true;
            document.getElementById("add-personnel-lname").required = true;
            document.getElementById("add-personnel-dept").required = true;
            document.getElementById("add-personnel-location").required = true;
            document.getElementById("add-personnel-email").required = true;
            document.getElementById("add-personnel-fname").classList.add("validate");
            document.getElementById("add-personnel-lname").classList.add("validate");
            document.getElementById("add-personnel-dept").classList.add("validate");
            document.getElementById("add-personnel-location").classList.add("validate");
            document.getElementById("add-personnel-email").classList.add("validate");
        };
        break;
    }
}));

$("#add-data-form").on("submit", (e) => {
    e.preventDefault();
    
    // if add-to-db has .personnel class:
    if ($("#current-modal").hasClass('submit-personnel')) {

        if ($("#add-data-form").hasClass("is-valid")) {

            $.ajax({
                url: "./public/php/insertPersonnel.php",
                type: "POST",
                dataType: "json",
                data: {
                    firstName: $("#add-personnel-fname").val(),
                    lastName: $("#add-personnel-lname").val(),
                    email: $("#add-personnel-email").val(),
                    departmentID: $("#add-personnel-dept").val()
                },
        
                success: result => {
                    if (result.status.name == "ok") {
                        
                        $("#create-success-msg").text("Person");
                        $("#add-data").modal("hide");
                        $("#create-success-btn").modal("show");

                        $("#create-success-btn").on('hidden.bs.modal', () => {
                            location.reload(true);
                        })
                    }
                },
        
                error: (errorThrown) => {
                    $("#create-success").text("Error");
                    $("#create-success-msg").attr('display', 'hide');
                    $("#create-success-error-msg").text("Sorry, there was an error adding this person. Please try again.")
                    console.log(`There was an error adding this person's details. Error: ${errorThrown}`);
                }
            });
        }
    }

    // if add-to-db has .department class:
    if ($("#current-modal").hasClass('submit-department')) {

        if ($("#add-data-form").hasClass("is-valid")) {

            $.ajax({
                url: "./public/php/insertDepartment.php",
                type: "POST",
                dataType: "json",
                data: {
                    name: $("#add-department-name").val(),
                    locationID: $("#add-department-location").val()
                },

                success: result => {
                    if (result.status.name == "ok") {
                        $("#create-success-msg").text("Department");
                        $("#add-data").modal("hide");
                        $("#create-success-btn").modal("show");

                        $("#create-success-btn").on('hidden.bs.modal', () => {
                            location.reload(true);
                        })
                    }
                },

                error: (errorThrown) => {
                    $("#create-success").text("Error");
                    $("#create-success-msg").attr('display', 'hide');
                    $("#create-success-error-msg").text("Sorry, there was an error adding this department. Please try again.");
                    console.log(`There was an error adding this department. Error: ${errorThrown}`);
                }
            });
        }
    }

    // if add-to-db has .submit-location class:
    if ($("#current-modal").hasClass('submit-location')) {
        
        // If form has .is-valid class from validate()
        if ($("#add-data-form").hasClass("is-valid")) {
    
            $.ajax({
                url: "./public/php/insertLocation.php",
                type: "POST",
                dataType: "json",
                data: {
                    name: $("#add-location-name").val(),
                },
        
                success: result => {
                    if (result.status.name == "ok") {
                    
                        $("#create-success-msg").text("Location");
                        $("#add-data").modal("hide");
                        $("#create-success-btn").modal("show");

                        $(document).on('click', (e) => {
                            if (!$(e.target).closest("#add-data").length && !$(e.target).is("#add-data")) {
                                    location.reload(true);
                            }
                        });
                    }
                },
        
                error: (errorThrown) => {
                    $("#create-success").text("Error");
                    $("#create-success-msg").attr('display', 'hide');
                    $("#create-success-error-msg").text("Sorry, there was an error adding this location. Please try again.")
                    console.log(`There was an error adding the location. Error: ${errorThrown}`);
                }
            });
        }
    }
});

// Create modal -- add Location corresponding to Department
$("#modal-personnel-tab").on('click', () => {
    $.ajax({
        url: "./public/php/getDepartmentByID.php",
        dataType: "json",
        type: "GET",
        data: {
            departmentID: $("#add-personnel-dept option:selected").val()
        },
        
        success: result => {
            if (result.status.name == "ok") {
                $("#add-personnel-location").html(`<option>${result.data[0].locationName}</option>`);

                $("#add-personnel-dept").on('change', () => {
                    $.ajax({
                        url: "./public/php/getDepartmentByID.php",
                        dataType: "json",
                        type: "GET",
                        data: {
                            departmentID: $("#add-personnel-dept option:selected").val()
                        },
                        
                        success: result => {
                            if (result.status.name == "ok") {
                                $("#add-personnel-location").html(`<option>${result.data[0].locationName}</option>`);
                            }
                        },
                        
                        error: () => {
                            console.log(`Error updating location!`);
                        }
                    });
                });
            }
        },
        
        error: () => {
            console.log(`Error retrieving location!`);
        }
    });
});



//////////////////////////////////////// EDIT DATA ////////////////////////////////////////

////// EDIT LOCATION //////
// Add location id and name to edit-location-modal 
stopButtonBlur('edit-location-modal', 'edit-location');

let locationID; 

$(document).on('click', '.edit-location', (e) => {
    locationID = parseInt(e.currentTarget.id.match(/\d+/g));
    
    $.ajax({
        url: "./public/php/getLocationByID.php",
        type: "GET",
        dataType: "json",
        data: {
            id: locationID
        },
        
        success: result => {
            if (result.status.name = "ok") {
                $(".edit-location-parent-div").html("");
                $(".edit-location-parent-div").append(`
                <label for="${result.data[0].id}" class="form-label validate" aria-required="true">City</label>
                <input type="text" id="input-edit-location-${result.data[0].id}" value="${result.data[0].name}" class="form-control input-edit-location" required>
                <div class="invalid-feedback">
                    Location is required.
                </div>
                <span class="error" id="edit-location-error"></span>`);
            }
        },

        error: (errorThrown) => {
            console.log(`Error editing location: ${errorThrown}`);
        }
    });
});


// Edit location modal
$("#edit-location-form").on("submit", (e) => {
    e.preventDefault();

    if ($("#edit-location-form").hasClass("is-valid")) {
        $.ajax({
            url: "./public/php/updateLocation.php",
            type: "POST",
            dataType: "json",
            data: {
               name: $(".input-edit-location").val(),
               locationID: locationID
            },
        
            success: result => {
                if( result.status.name == "ok") {
                    // $("#edit-location-form").removeClass("is-valid");
                    $("#edit-location-modal").modal('hide');
                    $("#edit-location-success").modal('show');
                    
                    $(document).on('click', (e) => {
                            if (!$(e.target).closest('#edit-location-modal').length && !$(e.target).is("#edit-location-modal")) {
                                location.reload(true);
                        }
                    });
                }
            },
        
            error: (errorThrown) => {
                $("#edit-location-success-title").text("Error");
                $("#edit-location-success-error").text("Sorry, there was an error updating this location. Please try again.");
                console.log(`There was an error updating this location. (Error type: ${errorThrown})`);
            }
        });
    }
});

////// EDIT PERSONNEL //////
// Add personnel info to edit-personnel
stopButtonBlur('edit-personnel-modal', 'edit-personnel');

$(document).on('click', '.edit-personnel', (e) => {
    personnelID = parseInt(e.currentTarget.id.match(/\d+/g));

    $.ajax({
        url: "./public/php/getPersonnelByID.php",
        dataType: "json",
        type: "GET",
        data: {
            personnelID: personnelID
        },

        success: result => {
            if (result.status.name == "ok") {
                $("#edit-personnel-fname").val(`${result.data.personnel[0].firstName}`);
                $("#edit-personnel-lname").val(`${result.data.personnel[0].lastName}`);
                $("#edit-personnel-email").val(`${result.data.personnel[0].email}`);
                $("#edit-personnel-dept").val(`${result.data.personnel[0].departmentID}`);
                $("#edit-personnel-location").val(result.data.department.find(d => d.id == result.data.personnel[0].departmentID).locationName);
            }
        },
        
        error: (errorThrown) => {
            console.log(`Error locating personnel ID (Error: ${errorThrown})`);
        }
    });
});

// Edit personnel modal -- add Location corresponding to Department
$("#edit-personnel-dept").on('change', () => {
    $.ajax({
        url: "./public/php/getDepartmentByID.php",
        dataType: "json",
        type: "GET",
        data: {
            departmentID: $("#edit-personnel-dept option:selected").val()
        },
        
        success: result => {
            if (result.status.name == "ok") {
                console.log(result);
                $("#edit-personnel-location").val(`${result.data[0].locationName}`);
            }
        },
        
        error: (errorThrown) => {
            console.log(`Error locating department ID in edit data modal (Error: ${errorThrown})`);
        }
    })
});

$("#edit-personnel-form").on('submit', (e) => {
    e.preventDefault();

    if ($("#edit-personnel-form").hasClass("is-valid")) {

        $.ajax({
            url: "./public/php/updatePersonnel.php",
            dataType: "json",
            type: "POST",
            data: {
                firstName: $("#edit-personnel-fname").val(),
                lastName: $("#edit-personnel-lname").val(),
                email: $("#edit-personnel-email").val(),
                departmentID: $("#edit-personnel-dept option:selected").val(),
                id: personnelID
            },
            
            success: result => {
                if (result.status.name == "ok") {
                    $("#edit-personnel-form").removeClass("is-valid");
                    $("#edit-personnel-modal").modal('hide');
                    $("#edit-personnel-success").modal('show');
                    
                    $(document).on('click', (e) => {
                            if (!$(e.target).closest('#edit-personnel-modal').length && !$(e.target).is("#edit-personnel-modal")) {
                                location.reload(true);
                        }
                    });
                }
            },
            
            error: (errorThrown) => {
                $("#edit-personnel-success-title").text("Error");
                $("#edit-personnel-success-error").text("Sorry, there was an error updating this person's record. Please try again.");
                console.log(`There was an error updating this person's records. (Error type: ${errorThrown})`);
            }
        })
    }
})

////// EDIT DEPARTMENT //////
stopButtonBlur('edit-department-modal', 'edit-department');

// Add department id and name to edit-department-modal 
let departmentID;
let deptID;

$(document).on('click', '.edit-department', (e) => {
    departmentID = parseInt(e.currentTarget.id.match(/\d+/g));
    
    $.ajax({
        url: "./public/php/getDepartmentByID.php",
        dataType: "json",
        type: "GET",
        data: {
            departmentID: departmentID
        },

        success: result => {
            if (result.status.name == "ok") {
                $("#edit-department-name").val(`${result.data[0]['departmentName']}`);
                $("#edit-department-location").val(`${result.data[0]['locationID']}`);
            }
        },
        
        error: (errorThrown) => {
            console.log(`Error locating department ID (Error: ${errorThrown})`);
        }
    });
});

// Edit department modal
$("#edit-department-form").on('submit', (e) => {
    e.preventDefault();

    if ($("#edit-department-form").hasClass("is-valid")) {
        $.ajax({
            url: "./public/php/updateDepartment.php",
            type: "POST",
            dataType: "json",
            data: {
                name: $(".input-edit-department").val(),
                locationID: $("#edit-department-location").val(),
                id: departmentID
            },
    
            success: result => {
                if (result.status.name == "ok") {
                    console.log("test");
                    // $("#edit-department-form").removeClass("is-valid");
                    $("#edit-department-modal").modal("hide");
                    $("#edit-department-success").modal("show");
                    
                    $(document).on('click', (e) => {
                            if (!$(e.target).closest('#edit-department-modal').length && !$(e.target).is("#edit-department-modal")) {
                                location.reload(true);
                        }
                    });
                }
            },
    
            error: (errorThrown) => {
                console.log(`There was an error updating this location. (Error type: ${errorThrown})`);
                $("#edit-department-success-title").text("Error");
                $("#edit-department-success-error").text("Sorry, there was an error updating this department. Please try again.");
            }
        });
    }
});

//////////////////////////////////////// DELETE DATA ////////////////////////////////////////

////// DELETE PERSONNEL //////
stopButtonBlur('delete-personnel-modal', 'delete-personnel');

let deletePersonnelID;

$(document).on('click', '.delete-personnel', (e) => {
    deletePersonnelID = parseInt(e.currentTarget.id.match(/\d+/g));

    $.ajax({
        url: "./public/php/getPersonnelByID.php",
        dataType: "json",
        type: "GET",
        data: {
            personnelID: deletePersonnelID
        },

        success: result => {
            if (result.status.name == "ok") {
                $("#delete-first-name").text(result.data.personnel[0].firstName);
                $("#delete-last-name").text(result.data.personnel[0].lastName);
            }
        },
        
        error: (errorThrown) => {
            console.log(`Error locating personnel ID (Error: ${errorThrown})`);
        }
    });
});

$("#save-delete-personnel").on('click', () => {
    $.ajax({
        url: "./public/php/deletePersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: deletePersonnelID
        },
    
        success: result => {
            if (result.status.name == "ok") {
                console.log("Person deleted!");
                $("#delete-personnel-success").on('hidden.bs.modal', () => {
                    location.reload(true);
                })
            }
        },
    
        error: (errorThrown) => {
            console.log(`There was an error deleting this person. Error type: ${errorThrown}`);
        }
    })
});

////// DELETE DEPARTMENT //////
stopButtonBlur('delete-department-modal', 'delete-department');

$(document).on('click', '.delete-department', (e) => {
    let deleteDepartmentID = parseInt(e.currentTarget.id.match(/\d+/g));

    // Check if department has dependencies
    $.ajax({
        url: "./public/php/checkDepartmentDependencies.php",
        dataType: "json",
        type: "GET",
        data: {
            departmentID: deleteDepartmentID
        },

        success: result => {
            if (result.status.name == "ok") {

                // If there are dependencies show error modal
                if (result.data[0]["COUNT(id)"] !== 0) {
                    $("#delete-department-modal").modal("hide");
                    $("#delete-department-success").modal("show");
                    $("#delete-department-success-title").text("Error");
                    $("#delete-department-msg").text("This department is linked to one or more personnel records so cannot be deleted.");
                } else {

                    // If no dependencies, retrieve department name and add to delete modal 
                    $.ajax({
                        url: "./public/php/getDepartmentByID.php",
                        dataType: "json",
                        type: "GET",
                        data: {
                            departmentID: deleteDepartmentID
                        },

                        success: result => {
                            $("#delete-department-modal").modal('show');
                            $("#delete-department-name").text(result.data[0].departmentName);
                        },

                        error: () => {
                            console.log("There was an error retrieving the department.");
                        }
                    });

                    // User selects DELETE button:
                    $("#save-delete-department").on("click", () => {
                        
                        $.ajax({
                            url: "./public/php/deleteDepartmentByID.php",
                            type: "POST",
                            dataType: "json",
                            data: {
                                id: deleteDepartmentID
                            },
    
                            success: () => {
                                if (result.status.name == "ok") {
    
                                    // Add success message to modal then reload
                                    $("#delete-department-success").modal("show");
                                    $("#delete-department-success-title").text("Success");
                                    $("#delete-department-msg").text("Department deleted!");
                                    $("#delete-department-success").on('hidden.bs.modal', () => {
                                        location.reload(true);
                                    });
                                }
                            },
    
                            error: (errorThrown) => {
                                console.log(`There was an error deleting this department. Error: ${errorThrown}`);
                                $("#delete-department-success-title").text("Error");
                                $("#delete-department-msg").text("Sorry, there was an error deleting this department. Please try again.");
                            }
                        })
                    });
                }
            }
        },

        error: () => {
            console.log("Error retrieving department dependencies");
        }
    });
});


////// DELETE Location //////

stopButtonBlur('delete-location-modal', 'delete-location');

let deleteLocationID;

$(document).on('click', '.delete-location', (e) => {
    deleteLocationID = parseInt(e.currentTarget.id.match(/\d+/g));

    $.ajax({
        url: "./public/php/checkLocationDependencies.php",
        dataType: "json",
        type: "GET",
        data: {
            locationID: deleteLocationID
        },

        success: result => {

            // If there are dependencies show error modal
            if (result.data[0]["COUNT(id)"] !== 0) {
                $("#delete-location-modal").modal("hide");
                $("#delete-location-success").modal("show");
                $("#delete-location-success-title").text("Error");
                $("#delete-location-msg").text("This location is linked to one or more department records so cannot be deleted.")
            } else {

                // if no dependencies add location name to delete modal
                $.ajax({
                    url: "./public/php/getLocationByID.php",
                    dataType: "json",
                    type: "GET",
                    data: {
                        id: deleteLocationID
                    },

                    success: result => {
                        $("#delete-location-modal").modal('show');
                        $("#delete-location-name").text(result.data[0].name);
                    },

                    error: () => {
                        console.log("There was an error retrieving the department.");
                    }
                });

                // User selects DELETE:
                $("#save-delete-location").on("click", () => {

                    $.ajax({
                        url: "./public/php/deleteLocationByID.php",
                        dataType: "json",
                        type: "POST",
                        data: {
                            id: deleteLocationID
                        },
    
                        success: () => {
                            $("#delete-location-modal").modal("show");
                            $("#delete-location-success-title").text("Success");
                            $("#delete-location-msg").text("Location deleted!");
                            $("#delete-location-success").on('hidden.bs.modal', () => {
                                location.reload(true);
                            });
                        },
    
                        error: (errorThrown) => {
                            console.log(`There was an error deleting this location. Error: ${errorThrown}`);
                            $("#delete-location-success-title").text("Error");
                            $("#delete-location-msg").text("Sorry, there was an error deleting this location. Please try again.");
                        }
                    });
                });
            }
        },

        error: () => {
            console.log("There was an error retrieving location dependencies.");
        }
    });
});


//////////////////////////////////////// SEARCH ////////////////////////////////////////
$("#search-btn").on("submit", e => {
    e.preventDefault();
    $(this).trigger('blur');
})

// Refresh results button
$("#refresh-search-btn").on('click', () => {
    $(".hide-location-container").show();
    $("#search-input").val("");
});

$("#search-bar").on("keyup", (e) => {
    e.preventDefault();

    //// Search Personnel
    if ($("#nav-personnel-tab").hasClass("active")) {

        $.ajax({
            url: "./public/php/searchPersonnel.php",
            dataType: "json",
            type: "GET",
            data: {
                search: `%${$("#search-input").val()}%`
            },

            success: result => {
                if (result.status.name == "ok") {

                    if (result.data == 0) {
                        // Hide all personnel, show "no results"
                        $(".hide-personnel-container").hide();
                        $(".no-results").show();
                    } else {
                        // Hide all personnel and only show results
                        $(".hide-personnel-container").hide();
                        $(".no-results").hide();

                        Object.entries(result.data).forEach(person => {
                            const id = person[1]['id'];
                            const lastName = person[1]['lastName'];
                            const firstName = person[1]['firstName'];
                            const email = person[1]['email'];
                            const departmentName = person[1]['departmentName'];
                            const locationName = person[1]['locationName'];
        
                            $("#nav-personnel-content").append(personnelContentCard(id, firstName, lastName, email, departmentName, locationName));                    
                        });
                    }
                }
            },

            error: (errorThrown) => {
                console.log(`There was an error retrieving department search results. Error: ${errorThrown}`)
            }
        });
    }
    //// Search Department
    if ($("#nav-department-tab").hasClass("active")) {

        $.ajax({
            url: "./public/php/searchDepartment.php",
            dataType: "json",
            type: "GET",
            data: {
                search: `%${$("#search-input").val()}%`,
            },

            success: result => {
                if (result.status.name == "ok") {
                    if (result.data == 0) {
                        // Hide all department, show "no results"
                        $(".hide-department-container").hide();
                        $(".no-results").show();
                    } else {
                        // Hide all departments and only show results
                        $(".hide-department-container").hide();
                        $(".no-results").hide();
    
                        Object.entries(result.data).forEach(department => {
    
                            const departmentID = department[1]['id'];
                            const departmentName = department[1]['departmentName'];
                            const departmentLocation = department[1]['locationName'];
        
                            // Add all departments to main content container
                            $("#nav-department-content").append(departmentContentCard(departmentID, departmentName, departmentLocation));
                        });
                    }
                }
            },

            error: (errorThrown) => {
                console.log(`There was an error retrieving department search results. Error: ${errorThrown}`)
            }
        });
    }
    
    //// Search Location
    if ($("#nav-location-tab").hasClass("active")) {

        $.ajax({
            url: "./public/php/searchLocation.php",
            dataType: "json",
            type: "GET",
            data: {
                search: `%${$("#search-input").val()}%`
            },

            success: result => {
                if (result.status.name == "ok") {
                    if (result.data == 0) {
                        // Hide all locations, show "no results"
                        $(".hide-location-container").hide();
                        $(".no-results").show();
                    } else {
                        // Hide all locations and only show results
                        $(".hide-location-container").hide();
                        $(".no-results").hide();
    
                        Object.entries(result.data).forEach(location => {
                            const locationID = location[1].id;
                            const locationName = location[1].name;
    
                            $("#nav-location-content").append(locationContentCard(locationID, locationName));
                        });
                    }
                }
            },

            error: (errorThrown) => {
                console.log(`There was an error retrieving location search results. Error: ${errorThrown}`)
            }
        });
    }
});

const personnelTab = $("#nav-personnel-tab");
const departmentTab = $("#nav-department-tab");
const locationTab = $("#nav-location-tab");

const refreshSearch = () => {
    if (!$("#search-input") == "") {
        $("#search-input").val("");
        $(".no-results").hide();
    }
}
personnelTab[0].addEventListener('click', refreshSearch);
departmentTab[0].addEventListener('click', refreshSearch);
locationTab[0].addEventListener('click', refreshSearch);