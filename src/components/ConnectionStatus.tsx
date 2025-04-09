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
        // Try GitHub Codespace URL format first for MongoDB
        try {
          const codespaceUrl = window.location.hostname;
          const mongoResponse = await fetch(
            `https://${codespaceUrl.replace("-5173", "-8080")}/api/health/mongo`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            },
          );
          setMongoStatus(mongoResponse.ok ? "connected" : "disconnected");
        } catch (error) {
          // Fallback to localhost
          try {
            const mongoResponse = await fetch(
              "http://localhost:8080/api/health/mongo",
            );
            setMongoStatus(mongoResponse.ok ? "connected" : "disconnected");
          } catch (fallbackError) {
            setMongoStatus("disconnected");
          }
        }

        // Try GitHub Codespace URL format first for Elasticsearch
        try {
          const codespaceUrl = window.location.hostname;
          const elasticResponse = await fetch(
            `https://${codespaceUrl.replace("-5173", "-8080")}/api/health/elasticsearch`,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            },
          );
          setElasticStatus(elasticResponse.ok ? "connected" : "disconnected");
        } catch (error) {
          // Fallback to localhost
          try {
            const elasticResponse = await fetch(
              "http://localhost:8080/api/health/elasticsearch",
            );
            setElasticStatus(elasticResponse.ok ? "connected" : "disconnected");
          } catch (fallbackError) {
            setElasticStatus("disconnected");
          }
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
