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
        // Check MongoDB connection
        const mongoResponse = await fetch(
          "http://localhost:8080/api/health/mongo",
        );
        setMongoStatus(mongoResponse.ok ? "connected" : "disconnected");
      } catch (error) {
        setMongoStatus("disconnected");
      }

      try {
        // Check Elasticsearch connection
        const elasticResponse = await fetch(
          "http://localhost:8080/api/health/elasticsearch",
        );
        setElasticStatus(elasticResponse.ok ? "connected" : "disconnected");
      } catch (error) {
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
