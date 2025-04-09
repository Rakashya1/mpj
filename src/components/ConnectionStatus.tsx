import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = "",
}) => {
  const [mongoStatus, setMongoStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");
  const [elasticStatus, setElasticStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");

  useEffect(() => {
    const checkConnections = async () => {
      try {
        // Get API base URL using the same logic as apiService
        const getApiBaseUrl = () => {
          const hostname = window.location.hostname;
          if (hostname.includes(".app.github.dev")) {
            return `https://${hostname.replace("-5173", "-8080")}`;
          }
          return "http://localhost:8080";
        };

        const API_BASE_URL = getApiBaseUrl();
        console.log("Checking connections using base URL:", API_BASE_URL);

        // Check MongoDB connection
        try {
          const mongoResponse = await fetch(
            `${API_BASE_URL}/api/health/mongo`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              // Add cache busting to prevent cached responses
              cache: "no-cache",
            },
          );
          console.log("MongoDB response:", mongoResponse.status);
          setMongoStatus(mongoResponse.ok ? "connected" : "disconnected");
        } catch (error) {
          console.error("MongoDB connection check failed:", error);
          setMongoStatus("disconnected");
        }

        // Check Elasticsearch connection
        try {
          const elasticResponse = await fetch(
            `${API_BASE_URL}/api/health/elasticsearch`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              // Add cache busting to prevent cached responses
              cache: "no-cache",
            },
          );
          console.log("Elasticsearch response:", elasticResponse.status);
          setElasticStatus(elasticResponse.ok ? "connected" : "disconnected");
        } catch (error) {
          console.error("Elasticsearch connection check failed:", error);
          setElasticStatus("disconnected");
        }
      } catch (error) {
        console.error("Error checking connections:", error);
        setMongoStatus("disconnected");
        setElasticStatus("disconnected");
      }
    };

    checkConnections();
    const interval = setInterval(checkConnections, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="flex items-center">
        <span className="text-sm mr-2">MongoDB:</span>
        {mongoStatus === "checking" ? (
          <span className="text-yellow-500 animate-pulse">Checking...</span>
        ) : mongoStatus === "connected" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </div>
      <div className="flex items-center">
        <span className="text-sm mr-2">Elasticsearch:</span>
        {elasticStatus === "checking" ? (
          <span className="text-yellow-500 animate-pulse">Checking...</span>
        ) : elasticStatus === "connected" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
