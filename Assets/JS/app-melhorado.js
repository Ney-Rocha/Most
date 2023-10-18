class FormSubmit {
    constructor(settings) {
        this.settings = settings;
        this.form = document.querySelector(settings.form);
        this.formButton = document.querySelector(settings.button);
        if (this.form) {
            this.url = this.form.getAttribute("action");
        }
        this.sendForm = this.sendForm.bind(this);

        this.formButton.addEventListener("click", this.validateAndSubmit.bind(this));
    }

    displaySuccess() {
        this.form.innerHTML = this.settings.success;
    }

    displayError(errorMessage) {
        // Exibe a mensagem de erro para cada campo preenchido erroneamente.
        const errorElement = document.createElement("div");
        errorElement.className = "error-message";
        errorElement.innerText = errorMessage;
        this.form.appendChild(errorElement);
    }

    clearErrors() {
        // Remove todas as mensagens de erro.
        const errorMessages = this.form.querySelectorAll(".error-message");
        errorMessages.forEach((error) => error.remove());
    }

    getFormObject() {
        const formObject = {};
        const fields = this.form.querySelectorAll("[name]");
        fields.forEach((field) => {
            formObject[field.getAttribute("name")] = field.value;
        });
        return formObject;
    }

    onSubmission(event) {
        event.preventDefault();
        event.target.disabled = true;
        event.target.innerText = "Enviando...";
    }

    async sendForm(e) {
        try {
            this.onSubmission(e);
            await fetch(this.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(this.getFormObject()),
            });

            this.displaySuccess();
        } catch (error) {
            this.displayError("Não foi possível enviar o formulário. Por favor, tente novamente.");
            throw new Error(error);
        }
    }

    validateAndSubmit(e) {
        e.preventDefault();
        this.clearErrors(); // Limpa mensagens de erro anteriores.

        if (this.validateForm()) {
            this.onSubmission(e);
            this.sendForm(e);
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll("[name]");
        let isValid = true; // Assume que o formulário é válido até encontrar um erro.

        for (const field of fields) {
            if (field.hasAttribute("required") && !field.value.trim()) {
                this.displayError(`Campo '${field.getAttribute("name")}' é obrigatório.`);
                isValid = false;
            }
            if (field.hasAttribute("type")) {
                const fieldType = field.getAttribute("type");
                if (fieldType === "email" && field.value.trim() && !this.validateEmail(field.value)) {
                    this.displayError(`Campo '${field.getAttribute("name")}' não é um e-mail válido.`);
                    isValid = false;
                }
                // Adicione mais verificações de tipo de campo, se necessário.
            }
        }
        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    init() {
        if (this.form)
            return this;
    }
}

const formSubmit = new FormSubmit({
    form: "[data-form]",
    button: "[data-button]",
    success: "<h1 class='text-success'>Mensagem enviada</h1>",
    error: "<h1 class='text-secondary'>Não foi possível enviar sua mensagem!</h1>",
});

formSubmit.init();
