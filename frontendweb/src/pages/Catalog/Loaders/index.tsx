import ContentLoader from 'react-content-loader';

import './styles.css';

const CardLoader = () => (
  <div className="card-loader-container">
    <ContentLoader
      speed={2}
      width={300}
      height={300}
      viewBox="0 0 300 300"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="6" y="0" rx="2" ry="2" width="400" height="400" />
    </ContentLoader>
  </div>
);

export default CardLoader;
