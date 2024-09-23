import Slider from 'react-slick';
import SeriesCard from './SeriesCard'; // Import updated SeriesCard
import CustomArrow from './CustomArrow'; // Import the CustomArrow component

const SeriesSlider = ({ series }) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        nextArrow: <CustomArrow direction="right" />,
        prevArrow: <CustomArrow direction="left" />,
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
      {series.map((item) => (
        <div key={item.id} className="p-2">
          <SeriesCard series={item} /> {/* Pass each series to SeriesCard */}
        </div>
      ))}
    </Slider>
  );
};

export default SeriesSlider;
