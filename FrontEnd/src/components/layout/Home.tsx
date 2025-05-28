import { Carousel, Button } from 'react-bootstrap';
import '../../styles/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const slides = [
        {
            image:
            'https://static.wixstatic.com/media/c820a1394be940a48bb2689017f4b611.jpg/v1/fill/w_2460,h_2577,fp_0.33_0.2,q_90,enc_avif,quality_auto/c820a1394be940a48bb2689017f4b611.jpg',
            caption: 'Bienvenidos a M - SHOP',
        },
        {
            image:
            'https://static.wixstatic.com/media/24536d_be671dd58cac4667b7d0a9b7fb811da0~mv2.jpg/v1/fill/w_1257,h_859,fp_0.42_0.31,q_90,enc_avif,quality_auto/24536d_be671dd58cac4667b7d0a9b7fb811da0~mv2.jpg',
            caption: 'Explora la Nueva Temporada',
        },
        {
            image:
            'https://static.wixstatic.com/media/24536d_8678e50abc4c41599ca28e40778a6ebc~mv2.jpg/v1/fill/w_1264,h_1324,fp_0.53_0.19,q_90,enc_avif,quality_auto/24536d_8678e50abc4c41599ca28e40778a6ebc~mv2.jpg',
            caption: 'Estilo y Tendencia 2025',
        },
    ];

    return (
        <div className="home-carousel">
            <Carousel fade interval={4000}>
                {slides.map((slide, index) => (
                    <Carousel.Item key={index}>
                        <img className="d-block w-100 carousel-img" src={slide.image} alt={`Slide ${index + 1}`} />
                        <Carousel.Caption className="carousel-caption-custom">
                            <h1>{slide.caption}</h1>
                            <Button variant="light" className="carousel-btn" onClick={() => navigate('/productos')}>
                                Ir a la Tienda
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default Home;
