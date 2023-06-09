import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Col, Container, Row, Modal, Button } from "react-bootstrap";
import { RootState } from "@/store/index";
import { removeFromCart, updateCartItemQuantity } from "@/store/features/cart";
import s from "./cart.module.scss";
import Link from "next/link";
import { useEffect } from "react";
import trash from "./Trash.png";
import Image from "next/image";
import { addToCart } from "@/store/features/cart"; // Import the addToCart action

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    // При завантаженні компонента перевіряємо, чи є збережені товари в localStorage
    const savedCartItems = localStorage.getItem("cart");
    if (savedCartItems) {
      // Якщо є збережені товари, то розпарсимо їх і диспетчеризуємо дію addToCart для кожного товару
      const parsedCartItems = JSON.parse(savedCartItems);
      parsedCartItems.forEach((item:any) => {
        dispatch(addToCart(item.product));
      });
    }
  }, []);

  const [showConfirmation, setShowConfirmation] = useState(false); // State variable for showing/hiding the confirmation modal
  const [productIdToDelete, setProductIdToDelete] = useState(null); // State variable for storing the product ID to delete

  const handleRemoveFromCart = (productId: number) => {
    // Set the product ID to delete and show the confirmation modal
    setProductIdToDelete(productId);
    setShowConfirmation(true);
  };

  const confirmRemoveFromCart = () => {
    // Delete the product from the cart and close the confirmation modal
    dispatch(removeFromCart(productIdToDelete));
    setShowConfirmation(false);
  };

  const cancelRemoveFromCart = () => {
    // Close the confirmation modal without deleting the product
    setShowConfirmation(false);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    // Диспетчеризуємо дію updateCartItemQuantity для оновлення кількості товару в кошику
    dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
  };

  const handleIncrementQuantity = (productId: number) => {
    // Знаходимо товар за його ідентифікатором
    const item = cartItems.find((item) => item.product.id === productId);
    if (item) {
      // Якщо товар знайдено, збільшуємо його кількість на 1 і викликаємо handleQuantityChange для оновлення кількості
      const newQuantity = item.quantity + 1;
      handleQuantityChange(productId, newQuantity);
    }
  };

  const handleDecrementQuantity = (productId: number) => {
    // Знаходимо товар за його ідентифікатором
    const item = cartItems.find((item) => item.product.id === productId);
    if (item && item.quantity > 1) {
      // Якщо товар знайдено і його кількість більша за 1, зменшуємо його кількість на 1 і викликаємо handleQuantityChange для оновлення кількості
      const newQuantity = item.quantity - 1;
      handleQuantityChange(productId, newQuantity);
    }
  };

  const saveCartItemsToLocalStorage = (items:any) => {
    // Зберігаємо товари в localStorage у вигляді рядка JSON
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <div style={{
      minHeight:'75vh'
    }}>
      <Container className="mt-5">
        <Row>
          <Col xs={12} className="mt-5">
            <h3 className={s.title}>MY SHOPPING BAG</h3>
            <p className={s.title__desc}>
              View current items in cart and finalize before checkout{" "}
            </p>
          </Col>
        </Row>
        <Row className="mt-4 mb-4">
          <Col xs={12} lg={8}>
            <div className={`d-flex flex-column mb-5 ${s.products}`}>
              {cartItems.length > 0 ? (
                // Якщо в кошику є товари, відображаємо їх
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className={`d-flex align-items-center ${s.product}`}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className={s.product__image}
                    />
                    <div className={`${s.product__content}`}>
                      <h6 className="d-flex justify-content-between">
                        {item.product.title}{" "}
                        <span>{item.product.price}$</span>
                      </h6>
                      <p className="mt-3">{item.product.description}</p>
                      <div className={s.quantity}>
                        <button
                          className={s.quantity__btn}
                          onClick={() =>
                            handleDecrementQuantity(item.product.id)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className={s.quantity__btn}
                          onClick={() =>
                            handleIncrementQuantity(item.product.id)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={s.product__btn}
                        onClick={() => handleRemoveFromCart(item.product.id)}
                      >
                        <Image src={trash} alt="delete" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Якщо кошик порожній, відображаємо відповідне повідомлення
                <p>Your basket is empty.</p>
              )}
            </div>
          </Col>
          <Col xs={12} lg={4}>
            <div className={` ${s.products__price}`}>
              <div className={s.totalPrice}>
                <h4 className="d-flex justify-content-between">
                  Total <span>{totalPrice.toFixed(2)}$</span>
                </h4>
                <p className="d-flex justify-content-between">
                  Items <span>{cartItems.length}</span>{" "}
                </p>
              </div>
            </div>
            {!isCartEmpty && (
              <Link href="/checkout">
                <button className={` mt-3 ${s.products__checkout}`}>
                  PROCEED TO CHECKOUT
                </button>
              </Link>
            )}
          </Col>
        </Row>
      </Container>

      {/* Confirmation Modal */}
      <Modal show={showConfirmation} onHide={cancelRemoveFromCart} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this item from your cart?</Modal.Body>
        <Modal.Footer>
          <button className={s.canceled} onClick={cancelRemoveFromCart}>
            Cancel
          </button>
          <button className={s.remove}  onClick={confirmRemoveFromCart}>
            Remove
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
