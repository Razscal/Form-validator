function Validator(options) {

    
   


    var formElement = document.querySelector(options.form);
    var rulesSelector = {};
    
    function validate(inputElement,rule) {
        const errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
        
        
        
        var rules = rulesSelector[rule.selector]
        for(var i = 0;i<rules.length;i++) {
            switch(inputElement.type){
                case 'select':
                case'checkbox':
                case'radio':
                errorMessage = rules[i](
                    formElement.querySelector(rule.selector + ':checked')
                )
                break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break;
            
        }
                    errorElement.textContent = errorMessage
                    if(errorMessage) {
                        errorElement.textContent = errorMessage
                       inputElement.closest(options.formGroupSelector).classList.add('invalid')
                    }
                    else {
                        errorElement.textContent = ''
                       inputElement.closest(options.formGroupSelector).classList.remove('invalid')
                    }
                    
                    
                    return !errorMessage
    }




    
    if (formElement) {

        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid =true;
            options.rules.forEach((rule)=>{
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement,rule)
                if(!isValid) {
                    isFormValid = false;
                }
        })
        
        if(isFormValid) {
            if(typeof options.onSubmit === 'function'){
                var enabledInput = formElement.querySelectorAll('[name]:not([disabled])')
                console.log(Array.from(enabledInput))
                var formValue = Array.from(enabledInput).reduce((values,input)=>{
                    switch(input.type) {
                        case 'select':
                            if(input.matches(':selected')) {
                                values[input.name] = input.value;
                            }
                        case 'radio':
                            if(input.matches(':checked')){
                                values[input.name] = input.value
                            }
                            break;
                        case 'checkbox':
                        if(input.matches(':checked')){
                            if(!Array.isArray(values[input.name])){
                                values[input.name] = [input.value]
                            }
                            else {
                                values[input.name].push(input.value)
                            }
                        }break;
                        
                        case 'file':
                                values[input.name] = input.files;
                        break;
                        default:
                            values[input.name] = input.value
                    }
                    return values;
                },{})
                options.onSubmit(
                   formValue
                )
            }
        }
        else {
           // formElement.submit();
        }
        
    }

         options.rules.forEach((rule)=>{
            
           
            if (!Array.isArray(rulesSelector[rule.selector])){
                rulesSelector[rule.selector]= [rule.test]
            }
            else  {
                rulesSelector[rule.selector].push(rule.test)
            }
            
            var inputElements = formElement.querySelectorAll(rule.selector)
            
            
            

            Array.from(inputElements).forEach((inputElement)=>{
                var errorElement = inputElement.closest(options.formGroupSelector).querySelector(options.errorSelector);
                inputElement.oninput = function() {
                    errorElement.textContent = ''
                   inputElement.closest(options.formGroupSelector).classList.remove('invalid')
                }
                inputElement.onblur = function() {
                    validate(inputElement,rule)
                }
                
                
            })
            
            
            
           
        })
        console.log(rulesSelector)

    }
}







Validator.isRequired = function (selector,message) {
    return {
        selector : selector,
        test : function (value) {
            if (typeof value === 'string') {
                return value.trim() ? undefined : message || 'Vui lòng nhập vào trường này'
            }
            else {
                return value ? undefined : message || 'Vui lòng nhập vào trường này'
            }
            
        }
    }
}

Validator.isEmail = function (selector,message) {
    return {
        selector : selector,
        test : function (value) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? undefined : message || 'Email không đúng vui lòng nhập lại'
        }
    }
}

Validator.minLength = function (selector,min,message) {
    return {
        selector : selector,
        test : function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập số lớn hơn ${min}`
        }
    }
}

Validator.isConfirmation = function (selector,getConfirmValue,message) {
    return {
        selector : selector,
        test : function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị không chính xác'
        }
    }
}


