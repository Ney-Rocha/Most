class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(settings.form);
        this.formButton = document.querySelector(settings.button);
        if (this.form) {
            this.url = this.form.getAttribute("action");
        }
        this.sendForm = this.sendForm.bind(this);

        if (this.formButton) {
            this.formButton.addEventListener("click", this.validateAndSubmit.bind(this));
        }
    }

    displaySuccess() {
        if (this.form) {
            this.form.innerHTML = this.settings.success;
        }
    }

    displayError(errorMessage, field) {
        if (field && field.parentNode) {
            const errorElement = document.createElement("span");
            errorElement.className = "error-message text-danger mt-2";
            errorElement.innerText = errorMessage;
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
    }

    clearErrors() {
        const errorMessages = this.form.querySelectorAll(".error-message");
        errorMessages.forEach((error) => error.remove());
    }

    getFormObject() {
        const formObject = {};
        if (this.form) {
            const fields = this.form.querySelectorAll("[name]");
            fields.forEach((field) => {
                if (field.type === "checkbox") {
                    formObject[field.getAttribute("name")] = field.checked ? "sim" : "não";
                } else if (field.tagName === "TEXTAREA") {
                    formObject[field.getAttribute("name")] = field.value;
                } else {
                    formObject[field.getAttribute("name")] = field.value;
                }
            });
        }
        return formObject;
    }

    onSubmission(event) {
        if (event) {
            event.preventDefault();
            if (event.target) {
                event.target.disabled = true;
                event.target.innerText = "Enviando...";
            }
        }
    }

    async sendForm(e) {
        try {
            this.onSubmission(e);
            if (this.url) {
                await fetch(this.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(this.getFormObject()),
                });
            }
            this.displaySuccess();
            window.location.href = "/simulador5.html";
            
        } catch (error) {
            this.displayError("Não foi possível enviar o formulário. Por favor, tente novamente.");
            throw new Error(error);
        }
    }

    validateAndSubmit(e) {
        if (this.form) {
            this.clearErrors();
            if (this.validateForm()) {
                this.onSubmission(e);
                this.sendForm(e);
            }
        }
    }

    validateForm() {
        if (this.form) {
            const fields = this.form.querySelectorAll("[name]");
            let isValid = true;
            for (const field of fields) {
                if (field.hasAttribute("required") && !field.value.trim()) {
                    this.displayError(`Campo '${field.getAttribute("name")}' é obrigatório.`, field);
                    isValid = false;
                }
                if (field.hasAttribute("type")) {
                    const fieldType = field.getAttribute("type");
                    if (fieldType === "email" && field.value.trim() && !this.validateEmail(field.value)) {
                        this.displayError(`Campo '${field.getAttribute("name")}' não é um e-mail válido.`, field);
                        isValid = false;
                    }
                    if (fieldType === "tel" && !this.validatePhoneNumber(field.value)) {
                        this.displayError(`Campo '${field.getAttribute("name")}' não é um número de telefone válido.`, field);
                        isValid = false;
                    }
                }
            }
            return isValid;
        }
        return false;
    }

    validatePhoneNumber(phoneNumber) {
        const cleanedNumber = phoneNumber.replace(/\D/g, '');
        return /^[0-9]{10,11}$/.test(cleanedNumber);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
    success: "<h1 class='text-success'>Mensagem enviada</h1>",
    error: "<h1 class='text-secondary'>Não foi possível enviar sua mensagem!</h1>",
});

// formSubmit.init();
