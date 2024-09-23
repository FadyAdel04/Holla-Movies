import Slider from 'react-slick';
import MovieCard from './MovieCard';
import CustomArrow from './CustomArrow'; // Import the CustomArrow component

export default function MovieSlider({ movies }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Number of visible slides
    slidesToScroll: 1, // Number of slides to scroll at a time
    nextArrow: <CustomArrow direction="right" />, // Custom right arrow
    prevArrow: <CustomArrow direction="left" />, // Custom left arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {movies.map((movie) => (
        <div key={movie.id} className="p-2">
          <MovieCard movie={movie} />
        </div>
      ))}
    </Slider>
  );
}
