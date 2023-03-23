function isValidEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
const formSubmissionAPI = '../api/form.php';
let w_email_invalid;
let w_form_success;
let w_form_fail;
function translateForm(lang) {
    switch(lang) {
        case "es":
            w_email_invalid = "Correo electrónico inválido";
            w_form_success = "Formulario envíado";
            w_form_fail = "El envío del formulario falló";
            break;
        case "en":
        default:
            w_email_invalid = "Invalid email address";
            w_form_success = "Form submitted";
            w_form_fail = "Form submission failed";
            break;
    }
}
function getParentByTagName(el, parentSelector) {
    let parents = [];
    let p = el.parentNode;
    while (p && p.parentNode && p.parentNode != document.documentElement && p.tagName.toLowerCase() != parentSelector) {
        parents.push(p);
        p = p.parentNode;
    }
    return p;
}

function wireForm() {
    let formEls = document.getElementsByTagName("form");
    for(el of formEls) {
        let submitBtnEls = el.getElementsByClassName("submit");
        for(el of submitBtnEls) {
            el.addEventListener("click",async function(e) {
                e.preventDefault();
                let formTarget = getParentByTagName(el,"form");
                let formName = formTarget.getAttribute("name");
                let formRecipient = formTarget.getAttribute("data-recipient");
                let formLanguage = formTarget.getAttribute("data-language");
                translateForm(formLanguage);
                let fieldName = formTarget.querySelectorAll("input[name='name']")[0];
                let fieldSubject = formTarget.querySelectorAll("input[name='subject']")[0];
                let fieldEmail = formTarget.querySelectorAll("input[name='email']")[0];
                let fieldPhone = formTarget.querySelectorAll("input[name='phone']")[0];
                let fieldMessage = formTarget.querySelectorAll("[name='message']")[0];
                let leadName = fieldName && fieldName.value;
                let leadSubject = fieldSubject && fieldSubject.value;
                let leadEmail = fieldEmail && fieldEmail.value;
                let leadPhone = fieldPhone && fieldPhone.value;
                let leadMessage = fieldMessage && fieldMessage.value;
                // #region VALIDATION
                if(!isValidEmail(leadEmail)) {
                    alert(w_email_invalid);
                    return false;
                }
                // #endregion
                // #region SUBMIT
                let pk = document.getElementById("pk").value;
                let payload = {
                    pk,
                    formName,
                    formRecipient,
                    leadName,
                    leadSubject,
                    leadEmail,
                    leadPhone,
                    leadMessage
                };
                let req = await fetch(formSubmissionAPI, {
                    method: "POST",
                    body: JSON.stringify(payload)
                });
                let res = await req.json();
                switch(parseInt(res.code)) {
                    case 1:
                        alert(w_form_success);
                        location.replace("/");
                        break;
                    case 0:
                    default:
                        alert(w_form_fail);
                        console.log("FORM SUBMISSION FAILED");
                        console.log(res);
                        return;
                }
                // #endregion
            });
        }
    }
}
if(document.readyState !== 'loading') {
    wireForm();
} else {
    document.addEventListener('DOMContentLoaded', wireForm);
}