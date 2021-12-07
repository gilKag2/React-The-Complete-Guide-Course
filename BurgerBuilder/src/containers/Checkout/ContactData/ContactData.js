import React, { Component } from 'react'

import styles from './ContactData.module.css'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import axios from '../../../axios-orders'
import Input from '../../../components/UI/Input/Input'

class ContactData extends Component {
	state = {
		orderForm: this.setUpOrderForm(),
		loading: false
	}

	orderHandler = (event) => {
		event.preventDefault()

		this.setState({ loading: true })
		const order = {

		}

		// alert('You CONTINUE!')
		axios.post('/orders.json', order).then(response => {
			this.setState({ loading: false })
			this.props.history.push('/')
		}).catch(error => {
			this.setState({ loading: false })
		})
	}

	inputChangedHandler = (event, elementId) => {
		// not deep clone, will only clone the form object but not its child 
		// objects(will just set the pointer to them so every change in the child object will effect the state which is not good)
		const updatedOrderForm = { ...this.state.orderForm };
		// clone only required element, but still if we try to change the element config object, it is not cloned so shouldnt change it
		const updatedFormElement = { ...updatedOrderForm[elementId] }

		updatedFormElement.value = event.target.value;
		updatedOrderForm[elementId] = updatedOrderForm;
		this.setState({ orderForm: updatedOrderForm })
	}

	render() {
		const formElements = []
		for (let key in this.state.orderForm) {
			formElements.push({
				id: key,
				config: this.state.orderForm[key]
			})
		}
		let form = (
			<form>
				{formElements.map(formElement => (
					<Input
						changed={(event) => this.inputChangedHandler(event, formElement.id)} key={formElement.id}
						elementtype={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value} />
				))}
				<Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
			</form>
		)
		if (this.state.loading) {
			form = <Spinner />
		}
		return (
			<div className={styles.ContactData}>
				<h4>Enter your Contact Data</h4>
				{form}
			</div>
		)
	}

	setUpOrderForm() {
		return {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your name',
				},
				value: ''
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street',
				},
				value: ''
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Zip Code',
				},
				value: ''
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country',
				},
				value: ''
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Email',
				},
				value: ''
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					],
				},
				value: ''
			},
		}
	}
}

export default ContactData