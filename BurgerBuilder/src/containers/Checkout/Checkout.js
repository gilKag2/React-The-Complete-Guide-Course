import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import ContactData from './ContactData/ContactData'


class Checkout extends Component {


	cancelHandler = () => {
		this.props.history.goBack()
	}

	continueHandler = () => {
		this.props.history.push('/checkout/contact-data')
	}

	render() {
		let summery = <Redirect to={"/"} />
		if (this.props.ingredients) {
			const purchasedRedirect = this.props.purchased ? <Redirect to={"/"} /> : null
			summery = (
				<div>
					{purchasedRedirect}
					<CheckoutSummary ingredients={this.props.ingredients} Cancel={this.cancelHandler} Continue={this.continueHandler} />
					<Route path={this.props.match.path + '/contact-data'} component={ContactData} />
				</div>
			)
		}
		return summery
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		purchased: state.order.purchased
	}
}


export default connect(mapStateToProps)(Checkout)