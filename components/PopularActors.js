import ActorCard from './ActorCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CustomArrow from './CustomArrow'; // Use the same custom arrow

export default function PopularActors({ actors }) {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1280, // Adjust for larger screens
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Popular Actors</h2>
      <Slider {...sliderSettings}>
        {actors.map((actor) => (
          <div key={actor.id} className="p-2">
            <ActorCard actor={actor} />
          </div>
        ))}
      </Slider>
    </section>
  );
}
