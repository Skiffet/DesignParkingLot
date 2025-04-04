'use client';

import React, { useState, useEffect } from 'react';
import '../ui/ParkingLot.css'; // ถ้าใช้ Tailwind อย่างเดียวสามารถลบได้
import Level from '../../lib/level';
import { AbstractVehicle } from '../../lib/vehicle';
import Bus from '../../lib/bus';
import Car from '../../lib/car';
import Motorcycle from '../../lib/motorcycle';
import Levels from '../../lib/models/Level';
import ParkingSpot from '../../lib/parkingSpot';
import { VehicleSize } from '../../lib/vehicleSize';

const getSpotClass = (spot: string): string => {
  return `spot-${spot}`;
};

const ParkingLot: React.FC = () => {
  const NUM_LEVELS = 3;
  const SPOTS_PER_LEVEL = 30;

  const [levels, setLevels] = useState<Level[]>(
    Array.from({ length: NUM_LEVELS }, (_, i) => new Level(i, SPOTS_PER_LEVEL))
  );

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/level/');
        const data = await response.json();
        const levelInstances = data.map(Level.fromData);

        setLevels(levelInstances);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };
  
    fetchLevels();
  }, []);


  const [parkedVehicles, setParkedVehicles] = useState<AbstractVehicle[]>([]);
  const [busFull, setBusFull] = useState(false);
  const [allFull, setAllFull] = useState(false);

  const vehicleTypes = [Bus, Car, Motorcycle];
  
  const saveLevelsToDB = async () => {
    const levelData = levels.map((level: any) => ({
      floor: level.getFloor ? level.getFloor() : level.floor,
      spots: level.getSpots
        ? level.getSpots().map((spot: ParkingSpot) => ({
            row: spot.getRow(),
            spotNumber: spot.getSpotNumber(),
            size: spot.getSize(),
            isAvailable: spot.isAvailable(),
            vehicleType: spot.getVehicleType?.(),
          }))
        : level.spots, // fallback if it's already plain
    }));
  
    try {
      const res = await fetch('/api/level/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ levels: levelData }),
      });
  
      const result = await res.json();
      console.log("📦 Save result:", result);
    } catch (err) {
      console.error("❌ Error saving levels:", err);
    }
  };

  // 🔵 จอดรถแบบสุ่ม
  const parkRandomVehicle = (): boolean => {
    console.log('🚗 Parking a random vehicle...');
    const MAX_ATTEMPTS = 20;
    let busBlocked = false;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const VehicleClass = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const vehicle = new VehicleClass();

      for (let level of levels) {
        if (level.parkVehicle(vehicle)) {
          setParkedVehicles(prev => [...prev, vehicle]);

          if (vehicle instanceof Bus) {
            setBusFull(false);
          }
          
          saveLevelsToDB();
          return true;
        }
      }

      if (vehicle instanceof Bus) {
        busBlocked = true;
      }
    }

    if (busBlocked) {
      setBusFull(true);
    }

    return false;
  };

  // 🔍 ตรวจว่าที่จอด Bus ยังว่างไหม
  const checkBusFull = (): boolean => {
    const testBus = new Bus();
    return !levels.some(level => level.canParkVehicle(testBus));
  };

  // 🟢 กดปุ่มเพื่อจอดรถ
  const handleParkVehicle = () => {
    const success = parkRandomVehicle();
    // console.log('Parked vehicle:', success);

    const isBusFull = checkBusFull();
    setBusFull(isBusFull);

    if (!success) {
      setAllFull(true);
    } else {
      setAllFull(false);
    }
  };

  // 🔴 ลบรถคันล่าสุด
  const handleRemoveLastVehicle = () => {
    if (parkedVehicles.length === 0) return;

    const lastVehicle = parkedVehicles[parkedVehicles.length - 1];
    lastVehicle.clearSpots();

    setParkedVehicles(prev => prev.slice(0, prev.length - 1));

    const isBusFull = checkBusFull();
    setBusFull(isBusFull);
    setAllFull(false);
  };

  const addDB = async () => {
    let size: VehicleSize;
    const newLevel = {
      floor: 1,
      spots: Array.from({ length: SPOTS_PER_LEVEL }, (_, i) => {
        if (i <= 9) {
          size = VehicleSize.Large;
        } else if (i <= 19) {
          size = VehicleSize.Compact;
        } else {
          size = VehicleSize.Motorcycle;
        }
    
        const spot = new ParkingSpot(null as any, 0, i, size);
    
        return {
          row: spot.getRow(),
          spotNumber: spot.getSpotNumber(),
          size: spot.getSize(),
          isAvailable: spot.isAvailable(),
          vehicleType: spot.getVehicleType(),
        };
      }),
    };

    try {
      const response = await fetch('/api/level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLevel),
      });
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data from server:', data);

    } catch (error) {
      console.error('Error saving data:', error);
    }

  }

  return (
    <div className="container">
      <h1 className="title">Parking Lot</h1>
      
      <button onClick={addDB} className="btn bg-green-500 text-white px-4 py-2 rounded mb-4">
        Add Level to DB
      </button>

      {/* 🔔 แจ้งเตือนเมื่อ Bus เต็ม */}
      {busFull && (
        <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🚫 ที่จอดรถ Bus เต็มแล้ว!
        </div>
      )}

      {/* ❌ แจ้งเตือนเมื่อที่จอดรถทุกประเภทเต็ม */}
      {allFull && (
        <div style={{ color: 'darkred', fontWeight: 'bold', marginBottom: '1rem' }}>
          ❌ ที่จอดรถทุกประเภทเต็มแล้ว!
        </div>
      )}

      {/* ปุ่มควบคุม */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={handleParkVehicle}
          className="btn bg-blue-500 text-white px-4 py-2 rounded"
        >
          Park Vehicle
        </button>

        <button
          onClick={handleRemoveLastVehicle}
          className="btn bg-red-500 text-white px-4 py-2 rounded"
          disabled={parkedVehicles.length === 0}
        >
          Remove Last Vehicle
        </button>
      </div>

      {/* 🔳 แสดงชั้นและช่อง */}
      {levels.map((level, index) => (
        <div key={index} className="level-section">
          <h2 className="level-title">Floor {index+1}</h2>
          <div className="parking-level">
            {level.print().map((spot, spotIndex) => (
              <div
                key={spotIndex}
                className={`spot ${getSpotClass(spot)}`}
              >
                {spot}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParkingLot;