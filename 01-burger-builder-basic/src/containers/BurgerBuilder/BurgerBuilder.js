import React, { Component } from 'react';

import Auxiliary from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';

import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {},
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    isLoading: false,
    error: false
  };

  componentDidMount() {
    axios.get("https://react-my-burger-cb384-default-rtdb.firebaseio.com/ingredients.json").then(response => {
      this.setState({ ingredients: response.data })
    }).catch(error => {
      this.setState({ error: true })
    })
  }

  updatePurchaseState = () => {
    const totalCountOfIngredients = Object.values(
      this.state.ingredients
    ).reduce((sum, next) => sum + next, 0);

    this.setState({
      purchasable: totalCountOfIngredients > 0
    });
  };

  addIngredientHandler = type => {
    this.setState(
      prevState => ({
        ingredients: {
          ...prevState.ingredients,
          [type]: prevState.ingredients[type] + 1
        },
        totalPrice: prevState.totalPrice + INGREDIENT_PRICES[type]
      }),
      () => this.updatePurchaseState()
    );
  };

  removeIngredientHandler = type => {
    // calculate new count of ingredients
    const oldCount = this.state.ingredients[type];
    // exit if no ingredient to remove
    if (oldCount <= 0) return;

    // update state
    this.setState(
      prevState => ({
        ingredients: { ...prevState.ingredients, [type]: oldCount - 1 },
        totalPrice: prevState.totalPrice - INGREDIENT_PRICES[type]
      }),
      () => this.updatePurchaseState()
    );
  };

  purchaseHandler = () => {
    // toggle order summary modal
    this.setState(prevState => ({ purchasing: !prevState.purchasing }));
  };

  purchaseContinueHandler = () => {
    this.setState({ isLoading: true })
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "gil kagan",
        address: {
          street:
            "street test",
          zipcode: "1255",
          country: "Israel",
        },
        email: "test@test.com",
      },
      deliveryMethod: "fast"
    }
    axios.post('/orders.json', order).then(response => {
      this.setState({ isLoading: false, purchasing: false })
    }).catch(error => {
      this.setState({ isLoading: false, purchasing: false })
      console.log(error)
    });
  };


  render() {
    // determine which Less buttons to disable
    const disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummery = null;

    if (this.state.isLoading) {
      orderSummery = <Spinner />
    }

    let burger = this.state.error ? <p>Cant load ingredients</p> : <Spinner />

    if (this.state.ingredients) {
      burger =
        <Auxiliary>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Auxiliary>
      orderSummery = <OrderSummary
        ingredients={this.state.ingredients}
        price={this.state.totalPrice}
        purchaseCanceled={this.purchaseHandler}
        purchaseContinued={this.purchaseContinueHandler}
      />
    }

    return (
      <Auxiliary>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseHandler}>
          {orderSummery}
        </Modal>
        {burger}
      </Auxiliary>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
