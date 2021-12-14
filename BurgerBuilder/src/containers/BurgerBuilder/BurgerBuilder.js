import React, { Component } from 'react'

import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import axios from '../../axios-orders'
import { connect } from 'react-redux'

import * as actionsTypes from '../../store/actions';


class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount() {
        // axios.get('https://myburgerbuilder-smajke.firebaseio.com/ingredients.json').then(response => {
        //     this.setState({ingredients: response.data})
        // }).catch(error => {this.setState({error: true})})
    }
    updatePurchaseState() {
        const ingredients = this.props.ingredients;
        const sum = Object.keys(ingredients).map(igKey => ingredients[igKey]).reduce((sum, el) => sum + el, 0);

        return sum > 0;
    }
    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }
    purchaseContinuedHandler = () => {
        const queryParams = [];
        for (let i in this.props.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ingredients[i]));
        }
        queryParams.push('price=' + this.props.price)
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }
    render() {
        let orderSummary = null
        let burger = this.state.error ? <h1 style={{ textAlign: 'center' }}>Ingredients can't be loaded!</h1> : <Spinner />
        const disabledInfo = {
            ...this.props.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        if (this.props.ingredients) {
            burger = <Aux>
                <Burger ingredients={this.props.ingredients} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState()}
                    ordered={this.purchaseHandler}
                    price={this.props.price}
                />
            </Aux>

            orderSummary = <OrderSummary
                ingredients={this.props.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinuedHandler}
                totalPrice={this.props.price} />
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionsTypes.ADD_INGREDIENT, ingredientName: ingName }),
        onIngredientRemoved: (ingName) => dispatch({ type: actionsTypes.REMOVE_INGREDIENT, ingredientName: ingName }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))
