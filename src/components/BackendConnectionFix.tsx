import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

const BackendConnectionFix = () => {
  const [mongoStatus, setMongoStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [elasticStatus, setElasticStatus] = useState<
    "checking" | "connected" | "disconnected"
  >("checking");
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkConnections = async () => {
    setIsChecking(true);
    setErrorMessage(null);

    try {
      // Check MongoDB connection
      try {
        const mongoResponse = await fetch(
          "http://localhost:8080/api/health/mongo",
        );
        setMongoStatus(mongoResponse.ok ? "connected" : "disconnected");
        if (!mongoResponse.ok) {
          const errorText = await mongoResponse.text();
          setErrorMessage((prev) =>
            prev ? `${prev}\nMongoDB: ${errorText}` : `MongoDB: ${errorText}`,
          );
        }
      } catch (error) {
        setMongoStatus("disconnected");
        setErrorMessage((prev) =>
          prev
            ? `${prev}\nMongoDB: ${error.message}`
            : `MongoDB: ${error.message}`,
        );
      }

      // Check Elasticsearch connection
      try {
        const elasticResponse = await fetch(
          "http://localhost:8080/api/health/elasticsearch",
        );
        setElasticStatus(elasticResponse.ok ? "connected" : "disconnected");
        if (!elasticResponse.ok) {
          const errorText = await elasticResponse.text();
          setErrorMessage((prev) =>
            prev
              ? `${prev}\nElasticsearch: ${errorText}`
              : `Elasticsearch: ${errorText}`,
          );
        }
      } catch (error) {
        setElasticStatus("disconnected");
        setErrorMessage((prev) =>
          prev
            ? `${prev}\nElasticsearch: ${error.message}`
            : `Elasticsearch: ${error.message}`,
        );
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnections();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Backend Connection Status</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">MongoDB:</span>
            {mongoStatus === "checking" ? (
              <span className="text-yellow-500 flex items-center gap-1">
                <RefreshCw className="h-4 w-4 animate-spin" /> Checking...
              </span>
            ) : mongoStatus === "connected" ? (
              <span className="text-green-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Connected
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Disconnected
              </span>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Elasticsearch:</span>
            {elasticStatus === "checking" ? (
              <span className="text-yellow-500 flex items-center gap-1">
                <RefreshCw className="h-4 w-4 animate-spin" /> Checking...
              </span>
            ) : elasticStatus === "connected" ? (
              <span className="text-green-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Connected
              </span>
            ) : (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Disconnected
              </span>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            <pre className="whitespace-pre-wrap text-sm mt-2">
              {errorMessage}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Troubleshooting Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Ensure Docker is running on your GitHub Codespace</li>
          <li>
            Check if all services are up with <code>docker-compose ps</code>
          </li>
          <li>
            If services are down, start them with{" "}
            <code>docker-compose up -d</code>
          </li>
          <li>
            Check logs for errors with{" "}
            <code>docker-compose logs mongodb elasticsearch</code>
          </li>
          <li>
            Verify the services are accessible from your Codespace environment
          </li>
          <li>
            Check if the backend application is properly configured to connect
            to the services
          </li>
        </ol>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
          <h3 className="font-medium text-yellow-800">
            GitHub Codespace Specific Issues
          </h3>
          <p className="mt-2 text-yellow-700">
            In GitHub Codespaces, services might need to be accessed using
            different hostnames than 'localhost'. Update the connection strings
            in your application.properties file to use the service names from
            docker-compose.yml instead of localhost.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
          <h3 className="font-medium text-blue-800">
            Suggested Configuration Changes
          </h3>
          <p className="mt-2 text-blue-700">
            In your application.properties file, ensure you're using the Docker
            service names:
          </p>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded mt-2 overflow-x-auto">
            {`# MongoDB Configuration
spring.data.mongodb.host=mongodb
spring.data.mongodb.port=27017

# Elasticsearch Configuration
spring.elasticsearch.rest.uris=http://elasticsearch:9200`}
          </pre>
        </div>
      </div>

      <Button onClick={checkConnections} disabled={isChecking} className="mt-4">
        {isChecking ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Checking Connections...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Connections Again
          </>
        )}
      </Button>
    </div>
  );
};

export default BackendConnectionFix;
