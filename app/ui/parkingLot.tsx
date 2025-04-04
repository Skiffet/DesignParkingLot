'use client';

import React, { useState } from 'react';
import '../ui/ParkingLot.css'; // ถ้าใช้ Tailwind อย่างเดียวสามารถลบได้
import Level from '../../lib/level';
import { AbstractVehicle } from '../../lib/vehicle';
import Bus from '../../lib/bus';
import Car from '../../lib/car';
import Motorcycle from '../../lib/motorcycle';

const getSpotClass = (spot: string): string => {
  return `spot-${spot}`;
};

const ParkingLot: React.FC = () => {
  const NUM_LEVELS = 3;
  const SPOTS_PER_LEVEL = 30;

  const [levels, setLevels] = useState<Level[]>(
    Array.from({ length: NUM_LEVELS }, (_, i) => new Level(i, SPOTS_PER_LEVEL))
  );

  const [parkedVehicles, setParkedVehicles] = useState<AbstractVehicle[]>([]);
  const [busFull, setBusFull] = useState(false);
  const [allFull, setAllFull] = useState(false);

  const vehicleTypes = [Bus, Car, Motorcycle];

  // 🔵 จอดรถแบบสุ่ม
  const parkRandomVehicle = (): boolean => {
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

  // console.log("levels", levels);

  return (
    <div className="container">
      <h1 className="title">Parking Lot</h1>

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