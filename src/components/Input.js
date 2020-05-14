import React, { useState, useEffect } from 'react';
import { IonLabel, IonItem, IonInput, IonNote } from '@ionic/react';
import { getFieldErrors } from '../functions/fieldvalidation';

const Input = props => {
    const [formErrors, setformErrors] = useState([]);
  
    useEffect(() => {
      function determineErrorMessage() {
        const field = props.formFields[props.fieldName];
        if (field && field.fieldErrors) {
  
          const errorMessages = [];
          for (let [key, value] of Object.entries(field.fieldErrors)) {
            if (value) {
              errorMessages.push(value);
            }
          }
          setformErrors(errorMessages)
        }
      }
      determineErrorMessage()
    }, [props.fieldName, props.formFields, props.setformFields]);

    useEffect(() => {
      setformErrors([])
    }, [props.tabChanged])

    function handleUserInput(e) {
      let fieldValue = e.target.value;
      const currentField = props.formFields[props.fieldName];
      if (typeof fieldValue == 'undefined') {
        fieldValue = currentField.fieldValue
      }

      const fieldErrors= getFieldErrors(currentField, e.target.value)

      const updatedField = {...props.formFields[props.fieldName], ...{fieldValue, fieldErrors}}
      props.setformFields({...props.formFields, [props.fieldName]: updatedField})
    }

    return (
      <React.Fragment>
        <IonItem>
          <IonLabel position="floating">{props.fieldName}</IonLabel>
          <IonInput type={props.type} clearOnEdit={props.clearOnEdit} onIonBlur={e => handleUserInput(e)}/>
          {formErrors.map((errorMessage, index) => <IonNote color="danger" key={index}>{errorMessage}</IonNote>)}
        </IonItem>
      </React.Fragment>
    )
}

export default React.memo(Input)