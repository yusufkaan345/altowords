import React from 'react';
import { Carousel } from 'react-bootstrap';
import homeAdv1 from '../../assets/images/home-adv1.jpg';
import homeAdv2 from '../../assets/images/home-adv2.jpg';

function HeroCarousel() {
  return (
    <div className="hero-carousel">
      <Carousel fade indicators={true} controls={true}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={homeAdv1}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={homeAdv2}
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroCarousel; 