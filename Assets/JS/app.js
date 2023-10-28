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

    displayError(errorMessage, field) {
        // Exibe a mensagem de erro diretamente abaixo do campo com erro.
        const errorElement = document.createElement("span");
        errorElement.className = "error-message  d-flex ml-20 strong text-danger mt-1";
        errorElement.innerText = errorMessage;

        // Insere a mensagem de erro após o campo com erro.
        field.parentNode.insertBefore(errorElement, field.nextSibling);
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
            window.location.href = "/simulador5.html";

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
                this.displayError(`Campo '${field.getAttribute("name")}' é obrigatório.`, field);
                isValid = false;
            }
            if (field.hasAttribute("type")) {
                const fieldType = field.getAttribute("type");
                if (fieldType === "email" && field.value.trim() && !this.validateEmail(field.value)) {
                    this.displayError(`Campo '${field.getAttribute("name")}' não é um e-mail válido.`, field);
                    isValid = false;
                }
                // Adicione mais verificações de tipo de campo, se necessário.
            }
        }
        return isValid;
    }
    
    validatePhoneNumber(phoneNumber) {
        // Remove espaços em branco e caracteres especiais do número de telefone.
        const cleanedNumber = phoneNumber.replace(/\D/g, '');

        // Verifica se o número de telefone é um celular com 11 dígitos ou um telefone fixo com 10 dígitos.
        const isPhoneNumberValid = /^[0-9]{10,11}$/.test(cleanedNumber);

        if (!isPhoneNumberValid) {
            return false;
        }

        // Adiciona a máscara com DDD (xx) xxxxx-xxxx ou (xx) xxxx-xxxx.
        const maskedPhoneNumber = cleanedNumber.length === 11
            ? `(${cleanedNumber.slice(0, 2)}) ${cleanedNumber.slice(2, 7)}-${cleanedNumber.slice(7)}`
            : `(${cleanedNumber.slice(0, 2)}) ${cleanedNumber.slice(2, 6)}-${cleanedNumber.slice(6)}`;

        // Atualiza o valor do campo com a versão formatada.
        this.form.querySelector("[name='telefone']").value = maskedPhoneNumber;

        return true;
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
    error: "<h1 class='text-danger'>Não foi possível enviar sua mensagem!</h1>",
});

formSubmit.init();
