# Start MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  mongo:latest

# Start Elasticsearch with reduced memory
docker run -d \
  --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms256m -Xmx256m" \
  docker.elastic.co/elasticsearch/elasticsearch:8.17.4

# Start MongoDB CLI to check data
docker exec -it mongodb mongosh
use ecommerce
db.orders.find()  # View all orders
db.products.find() # View all products

# Navigate to backend directory
cd /workspaces/e-commerce-website/java-ecommerce

# Build and run with data initialization
./mvnw spring-boot:run -Dspring.profiles.active=dev

# API Endpoints for checking data:
# List all orders: GET http://localhost:8080/api/orders
# List all products: GET http://localhost:8080/api/products
# View specific order: GET http://localhost:8080/api/orders/{orderId}

# Navigate to frontend directory 
cd /workspaces/e-commerce-website

# Install dependencies
npm install

# Start development server
npm run dev