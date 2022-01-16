import React, { Component } from 'react'

import styles from './ContactData.module.css'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import axios from '../../../axios-orders'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'
import { purchaseBurger } from '../../../store/actions/index'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import { updateObject,  checkValidity } from '../../../shared/utility';

class ContactData extends Component {
	state = {
		orderForm: this.setUpOrderForm(),
		isFormValid: false,
	}

	orderHandler = (event) => {
		event.preventDefault()
		const formData = {}
		for (let formElement in this.state.orderForm) {
			formData[formElement] = this.state.orderForm[formElement].value
		}
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price,
			order: formData,
			userId: this.props.userId
		}

		this.props.onOrderBurger(order, this.props.token)

	}

	inputChangedHandler = (event, elementId) => {

		// clone only required element, but still if we try to change the element config object, it is not cloned so shouldnt change it
		const updatedFormElement = updateObject(this.state.orderForm[elementId], {
			value: event.target.value,
			touched: true,
			valid: checkValidity(event.target.value, this.state.orderForm[elementId].validation)
		})

		// not deep clone, will only clone the form object but not its child 
		// objects(will just set the pointer to them so every change in the child object will effect the state which is not good)
		const updatedOrderForm = updateObject(this.state.orderForm, {
			[elementId]: updatedFormElement
		});

		let isFormValid = true;
		for (let element in updatedOrderForm) {
			isFormValid = updatedOrderForm[element].valid && isFormValid;
		}
		this.setState({ orderForm: updatedOrderForm, isFormValid: isFormValid })
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
			<form onSubmit={this.orderHandler}>
				{formElements.map(formElement => (
					<Input
						key={formElement.id}
						changed={(event) => this.inputChangedHandler(event, formElement.id)}
						elementtype={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						invalid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched} />
				))}
				<Button btnType='Success' clicked={this.orderHandler} disabled={!this.state.isFormValid}>ORDER</Button>
			</form>
		)
		if (this.props.loading) {
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
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false
			},
			zipCode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Zip Code',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Email',
				},
				value: '',
				validation: {
					required: true,
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{ value: 'fastest', displayValue: 'Fastest' },
						{ value: 'cheapest', displayValue: 'Cheapest' }
					],
				},
				value: 'fastest',
				valid: true,
				validation: {}
			},
		}
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData, token) => dispatch(purchaseBurger(orderData, token))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));