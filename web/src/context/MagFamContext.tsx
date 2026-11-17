import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePlayer } from './PlayerContext';
import {
  MagFamEnhancedCreature,
  DofusFoodType,
  MagFamActiveSubTab,
  MagFamExpedition,
  PlacedFurniture,
  DofusCombatStats,
  TactileInteractionResult,
} from '../types/magfam';
import {
  INITIAL_ENHANCED_CREATURES,
  FOOD_CATALOG,
  FURNITURE_CATALOG,
  ACCESSORIES_CATALOG,
  EXPEDITION_DESTINATIONS,
} from '../data/magfamData';

interface MagFamContextType {
  creatures: MagFamEnhancedCreature[];
  activeCreature: MagFamEnhancedCreature;
  selectCreature: (id: string) => void;
  activeSubTab: MagFamActiveSubTab;
  setActiveSubTab: (tab: MagFamActiveSubTab) => void;
  activeTool: 'none' | 'sponge' | 'food' | 'ball' | 'brush' | 'medicine';
  setActiveTool: (tool: 'none' | 'sponge' | 'food' | 'ball' | 'brush' | 'medicine') => void;

  // Tactile Petting & Quick Play
  petCombo: number;
  tactilePetCreature: () => Promise<TactileInteractionResult>;
  resetPetCombo: () => void;

  // Companion Care & Vital Management
  feedActiveCreature: (foodId: DofusFoodType) => Promise<{ success: boolean; message: string }>;
  washActiveCreature: () => void;
  petActiveCreature: () => void;
  toggleSleep: () => void;
  giveMedicine: () => void;
  disciplineCreature: () => void;
  resurrectCreature: () => Promise<boolean>;

  // Inventory & Economy
  foodInventory: Record<DofusFoodType, number>;
  buyFood: (foodId: DofusFoodType, quantity: number) => Promise<boolean>;
  ownedAccessories: string[];
  buyAccessory: (accId: string) => Promise<boolean>;
  equipAccessory: (accId: string, slot: 'hat' | 'glasses' | 'collar' | 'wings' | 'aura') => void;
  unequipAccessory: (slot: 'hat' | 'glasses' | 'collar' | 'wings' | 'aura') => void;

  // Room Decoration & Habitat
  ownedFurniture: string[];
  buyFurniture: (furnitureId: string) => Promise<boolean>;
  placeFurnitureItem: (furnitureId: string, x: number, y: number) => void;
  removeFurnitureItem: (instanceId: string) => void;
  changeWallpaper: (wallpaperId: string) => void;
  changeFlooring: (flooringId: string) => void;
  cleanRoom: () => void;

  // Minigames & Rewards
  completeMinigame: (gameName: string, score: number, rewardMc: number, rewardXp: number) => void;

  // Expeditions
  startExpedition: (destinationId: string) => Promise<{ success: boolean; message: string }>;
  claimExpeditionReward: () => void;

  // Breeding Lab
  breedCreatures: (p1Id: string, p2Id: string, name: string) => Promise<{ success: boolean; message: string }>;
  hatchActiveEgg: () => void;

  // Active player bonuses from primary active MagFam
  totalDofusBonus: DofusCombatStats;
}

const MagFamContext = createContext<MagFamContextType | undefined>(undefined);

export const MagFamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { player, addXpAndMp, spendCurrency, awardReward, playSoundEffect } = usePlayer();

  // Load creatures from localStorage or default initial catalog
  const [creatures, setCreatures] = useState<MagFamEnhancedCreature[]>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_magfam_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Ignore fallback
    }
    return INITIAL_ENHANCED_CREATURES;
  });

  const [activeCreatureId, setActiveCreatureId] = useState<string>(() => {
    return creatures[0]?.id || 'mf-1';
  });

  const [activeSubTab, setActiveSubTab] = useState<MagFamActiveSubTab>('habitat');
  const [activeTool, setActiveTool] = useState<'none' | 'sponge' | 'food' | 'ball' | 'brush' | 'medicine'>('none');

  // Food inventory
  const [foodInventory, setFoodInventory] = useState<Record<DofusFoodType, number>>(() => {
    try {
      const saved = localStorage.getItem('magnopvs_magfam_food');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      plasma_fruit: 6,
      aether_fish: 4,
      biotech_kibble: 10,
      quantum_seed: 5,
      soul_essence: 2,
      solar_nectar: 1,
    };
  });

  // Owned accessories & furniture
  const [ownedAccessories, setOwnedAccessories] = useState<string[]>(() => {
    return ['acc-vr-glasses', 'acc-golden-crown', 'acc-aether-collar', 'acc-plasma-wings'];
  });

  const [ownedFurniture, setOwnedFurniture] = useState<string[]>(() => {
    return [
      'furn-cryo-bed',
      'furn-cyber-sofa',
      'furn-holo-aquarium',
      'furn-biolum-plant',
      'furn-quantum-ball',
      'furn-wall-tokyo',
      'furn-wall-nebula',
      'furn-floor-hex',
    ];
  });

  // Tactile Petting & Combo Streak State
  const [petCombo, setPetCombo] = useState<number>(0);
  const [lastPetTime, setLastPetTime] = useState<number>(0);
  const comboTimeoutRef = React.useRef<any>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('magnopvs_magfam_v2', JSON.stringify(creatures));
  }, [creatures]);

  useEffect(() => {
    localStorage.setItem('magnopvs_magfam_food', JSON.stringify(foodInventory));
  }, [foodInventory]);

  const activeCreature =
    creatures.find((c) => c.id === activeCreatureId) || creatures[0] || INITIAL_ENHANCED_CREATURES[0];

  const selectCreature = (id: string) => {
    playSoundEffect('click');
    setActiveCreatureId(id);
  };

  // 1. Feeding (Meal Schedule & Biological Nutrition)
  const feedActiveCreature = async (foodId: DofusFoodType): Promise<{ success: boolean; message: string }> => {
    const qty = foodInventory[foodId] || 0;
    if (qty <= 0) {
      return { success: false, message: 'No tienes esta comida en tu inventario. Cómprala en la tienda de MagFams.' };
    }

    const foodInfo = FOOD_CATALOG.find((f) => f.id === foodId);
    if (!foodInfo) return { success: false, message: 'Comida inválida.' };

    playSoundEffect('buy');

    // Decrement food inventory
    setFoodInventory((prev) => ({
      ...prev,
      [foodId]: Math.max(0, prev[foodId] - 1),
    }));

    // Update creature stats
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;

        const newHunger = Math.min(100, c.needs.hunger + foodInfo.nutritionGain);
        const newHappiness = Math.min(100, c.needs.happiness + foodInfo.happinessGain);
        const isFavorite = c.diet.favoriteFood === foodId;
        const extraAffinity = isFavorite ? 5 : 2;

        // Combat stats bonus progression
        const updatedCombatStats = { ...c.combatStats };
        if (foodInfo.statsBonusTarget) {
          const currentStat = updatedCombatStats[foodInfo.statsBonusTarget] || 0;
          if (currentStat < updatedCombatStats.maxStatCap) {
            updatedCombatStats[foodInfo.statsBonusTarget] = currentStat + (isFavorite ? 2 : 1);
          }
        }

        // Check evolution or level up
        let newXp = c.experience + 80;
        let newLevel = c.level;
        let newMaxXp = c.maxExperience;
        let newStage = c.stage;

        if (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = Math.floor(newMaxXp * 1.25);
          playSoundEffect('level');

          // Stage evolution triggers (Lifecycle)
          if (newLevel >= 10 && newStage === 'baby') newStage = 'child';
          else if (newLevel >= 30 && newStage === 'child') newStage = 'teen';
          else if (newLevel >= 60 && newStage === 'teen') newStage = 'adult';
          else if (newLevel >= 90 && newStage === 'adult') newStage = 'ascended';
        }

        return {
          ...c,
          level: newLevel,
          stage: newStage,
          experience: newXp,
          maxExperience: newMaxXp,
          status: newHunger >= 95 ? 'happy' : 'normal',
          needs: {
            ...c.needs,
            hunger: newHunger,
            happiness: newHappiness,
            health: Math.min(100, c.needs.health + 5),
          },
          combatStats: updatedCombatStats,
          diet: {
            ...c.diet,
            lastFedTimestamp: new Date().toISOString(),
            mealsCount: c.diet.mealsCount + 1,
            statusEffect: newHunger > 95 ? 'corpulent' : 'healthy',
          },
        };
      })
    );

    addXpAndMp(15, 30);
    return {
      success: true,
      message: `¡${activeCreature.name} disfrutó el ${foodInfo.name}! +${foodInfo.nutritionGain}% nutrición y bonus de combate permanente.`,
    };
  };

  // 2. Washing & Hygiene
  const washActiveCreature = () => {
    playSoundEffect('flash');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          status: 'happy',
          needs: {
            ...c.needs,
            hygiene: 100,
            happiness: Math.min(100, c.needs.happiness + 20),
          },
          room: {
            ...c.room,
            cleanliness: 100,
          },
        };
      })
    );
  };

  // 3. Petting & Tactile Quick Play Interaction
  const resetPetCombo = () => {
    setPetCombo(0);
  };

  const tactilePetCreature = async (): Promise<TactileInteractionResult> => {
    const now = Date.now();
    // If last pet was within 3.5 seconds, advance combo; else reset to 1
    const newCombo = (now - lastPetTime < 3500 && lastPetTime > 0) ? petCombo + 1 : 1;
    setPetCombo(newCombo);
    setLastPetTime(now);

    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    comboTimeoutRef.current = setTimeout(() => {
      setPetCombo(0);
    }, 3500);

    // Calculate reward: 1 MicroCoin per pet, plus bonus for combo bursts (5x, 10x, 15x...)
    const isComboBurst = newCombo > 1 && newCombo % 5 === 0;
    const baseMicroCoins = 1;
    const burstBonus = isComboBurst ? Math.min(5, Math.floor(newCombo / 5) * 2) : 0;
    const totalMcEarned = baseMicroCoins + burstBonus;
    const xpEarned = isComboBurst ? 20 : 5;
    const happinessGain = isComboBurst ? 18 : 6;

    // Atomically award MicroCoins to player's wallet
    await awardReward(
      'MICROCOIN',
      totalMcEarned,
      'MAGFAM_TACTILE_PET',
      `Caricias táctiles con ${activeCreature.name} (Combo x${newCombo})`,
      `tactile-${now}-${Math.random().toString(36).substring(2, 7)}`
    );

    addXpAndMp(xpEarned, 0);

    if (isComboBurst) {
      playSoundEffect('level');
    } else {
      playSoundEffect('quest');
    }

    // Update creature happiness and affinity
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          status: 'happy',
          needs: {
            ...c.needs,
            happiness: Math.min(100, c.needs.happiness + happinessGain),
            discipline: Math.min(100, c.needs.discipline + 2),
          },
          affinity: Math.min(100, (c as any).affinity ? (c as any).affinity + 1 : 85),
        };
      })
    );

    let message = `+${totalMcEarned} µC`;
    if (isComboBurst) {
      message = `¡Frenesí de Afecto x${newCombo}! +${totalMcEarned} µC y +${xpEarned} XP`;
    }

    return {
      success: true,
      microCoinsEarned: totalMcEarned,
      comboCount: newCombo,
      isComboBurst,
      message,
      xpEarned,
      happinessEarned: happinessGain,
    };
  };

  const petActiveCreature = () => {
    tactilePetCreature();
  };

  // 4. Toggle Sleep Mode (Night capsule)
  const toggleSleep = () => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        const willSleep = c.status !== 'sleeping';
        return {
          ...c,
          status: willSleep ? 'sleeping' : 'normal',
          needs: {
            ...c.needs,
            energy: willSleep ? 100 : c.needs.energy,
          },
        };
      })
    );
  };

  // 5. Medicine
  const giveMedicine = () => {
    playSoundEffect('quest');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          status: 'normal',
          hp: c.maxHp,
          needs: {
            ...c.needs,
            health: 100,
            happiness: Math.min(100, c.needs.happiness + 15),
          },
        };
      })
    );
  };

  // 6. Discipline
  const disciplineCreature = () => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          needs: {
            ...c.needs,
            discipline: Math.min(100, c.needs.discipline + 20),
          },
        };
      })
    );
  };

  // 7. Creature Resurrection
  const resurrectCreature = async (): Promise<boolean> => {
    if (activeCreature.hp > 0 && activeCreature.status !== 'ghost') return false;

    const cost = 100;
    const spendRes = await spendCurrency('MP', cost, 'MAGFAM_RESURRECTION', `Resurrección de MagFam: ${activeCreature.name}`);
    if (!spendRes.success) return false;

    playSoundEffect('hatch');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          status: 'normal',
          hp: c.maxHp,
          needs: {
            ...c.needs,
            health: 100,
            energy: 100,
            hunger: 80,
          },
        };
      })
    );
    return true;
  };

  // 8. Buy Food
  const buyFood = async (foodId: DofusFoodType, quantity: number): Promise<boolean> => {
    const food = FOOD_CATALOG.find((f) => f.id === foodId);
    if (!food) return false;
    const totalCost = food.priceMp * quantity;

    const res = await spendCurrency('MP', totalCost, 'MAGFAM_FOOD_STORE', `Compra de alimento: ${quantity}x ${food.name}`);
    if (!res.success) return false;

    playSoundEffect('buy');
    setFoodInventory((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + quantity,
    }));
    return true;
  };

  // 9. Buy & Equip Accessory
  const buyAccessory = async (accId: string): Promise<boolean> => {
    const acc = ACCESSORIES_CATALOG.find((a) => a.id === accId);
    if (!acc || ownedAccessories.includes(accId)) return false;

    const res = await spendCurrency('MP', acc.priceMp, 'MAGFAM_WARDROBE', `Compra accesorio: ${acc.name}`);
    if (!res.success) return false;

    playSoundEffect('buy');
    setOwnedAccessories((prev) => [...prev, accId]);
    return true;
  };

  const equipAccessory = (accId: string, slot: 'hat' | 'glasses' | 'collar' | 'wings' | 'aura') => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          equippedAccessories: {
            ...c.equippedAccessories,
            [slot]: accId,
          },
        };
      })
    );
  };

  const unequipAccessory = (slot: 'hat' | 'glasses' | 'collar' | 'wings' | 'aura') => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        const newAcc = { ...c.equippedAccessories };
        delete (newAcc as any)[slot];
        return {
          ...c,
          equippedAccessories: newAcc,
        };
      })
    );
  };

  // 10. Buy & Place Furniture
  const buyFurniture = async (furnitureId: string): Promise<boolean> => {
    const furn = FURNITURE_CATALOG.find((f) => f.id === furnitureId);
    if (!furn || ownedFurniture.includes(furnitureId)) return false;

    const res = await spendCurrency('MP', furn.priceMp, 'MAGFAM_FURNITURE', `Compra mueble: ${furn.name}`);
    if (!res.success) return false;

    playSoundEffect('buy');
    setOwnedFurniture((prev) => [...prev, furnitureId]);
    return true;
  };

  const placeFurnitureItem = (furnitureId: string, x: number, y: number) => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        const newPlaced: PlacedFurniture = {
          instanceId: `pi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          furnitureId,
          x: Math.min(90, Math.max(10, x)),
          y: Math.min(85, Math.max(30, y)),
          zIndex: c.room.placedItems.length + 1,
        };
        return {
          ...c,
          room: {
            ...c.room,
            placedItems: [...c.room.placedItems, newPlaced],
          },
        };
      })
    );
  };

  const removeFurnitureItem = (instanceId: string) => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          room: {
            ...c.room,
            placedItems: c.room.placedItems.filter((i) => i.instanceId !== instanceId),
          },
        };
      })
    );
  };

  const changeWallpaper = (wallpaperId: string) => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          room: {
            ...c.room,
            wallpaper: wallpaperId,
          },
        };
      })
    );
  };

  const changeFlooring = (flooringId: string) => {
    playSoundEffect('click');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          room: {
            ...c.room,
            flooring: flooringId,
          },
        };
      })
    );
  };

  const cleanRoom = () => {
    playSoundEffect('quest');
    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          room: {
            ...c.room,
            cleanliness: 100,
          },
        };
      })
    );
  };

  // 11. Minigame Complete
  const completeMinigame = (gameName: string, score: number, rewardMc: number, rewardXp: number) => {
    playSoundEffect('quest');
    addXpAndMp(rewardXp, 0);
    awardReward('MICROCOIN', rewardMc, 'MAGFAM_MINIGAME', `Minijuego MagFam: ${gameName} (Score: ${score})`, `mg-${Date.now()}`);

    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          needs: {
            ...c.needs,
            happiness: Math.min(100, c.needs.happiness + 25),
            energy: Math.max(10, c.needs.energy - 15),
          },
        };
      })
    );
  };

  // 12. Expeditions
  const startExpedition = async (destinationId: string): Promise<{ success: boolean; message: string }> => {
    const dest = EXPEDITION_DESTINATIONS.find((d) => d.id === destinationId);
    if (!dest) return { success: false, message: 'Destino no válido' };

    if (activeCreature.status === 'on_expedition') {
      return { success: false, message: 'Este MagFam ya está en una expedición cósmica.' };
    }

    if (activeCreature.needs.energy < 20) {
      return { success: false, message: 'Tu MagFam está demasiado agotado para salir de expedición. Déjalo dormir.' };
    }

    playSoundEffect('portal');
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + dest.durationMinutes * 60000).toISOString();

    const newExpedition: MagFamExpedition = {
      id: `exp-${Date.now()}`,
      creatureId: activeCreature.id,
      nodeName: dest.name,
      destinationIcon: dest.icon,
      durationMinutes: dest.durationMinutes,
      startTime,
      endTime,
      rewardClaimed: false,
      possibleRewards: dest.rewards,
    };

    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          status: 'on_expedition',
          activeExpedition: newExpedition,
          needs: {
            ...c.needs,
            energy: Math.max(0, c.needs.energy - 20),
          },
        };
      })
    );

    return {
      success: true,
      message: `¡${activeCreature.name} partió rumbo a ${dest.name}! Regresará en ${dest.durationMinutes} minutos.`,
    };
  };

  const claimExpeditionReward = () => {
    if (!activeCreature.activeExpedition) return;
    const rew = activeCreature.activeExpedition.possibleRewards;

    playSoundEffect('quest');
    addXpAndMp(rew.xp, rew.mp);
    if (rew.mc > 0) {
      awardReward('MICROCOIN', rew.mc, 'MAGFAM_EXPEDITION', `Recompensa de expedición: ${activeCreature.activeExpedition.nodeName}`, `exp-${Date.now()}`);
    }

    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          status: 'happy',
          activeExpedition: null,
          experience: c.experience + rew.xp,
        };
      })
    );
  };

  // 13. Breeding Lab (Cruce genético)
  const breedCreatures = async (p1Id: string, p2Id: string, name: string): Promise<{ success: boolean; message: string }> => {
    const p1 = creatures.find((c) => c.id === p1Id);
    const p2 = creatures.find((c) => c.id === p2Id);
    if (!p1 || !p2 || p1.id === p2.id) {
      return { success: false, message: 'Selecciona dos MagFams diferentes y compatibles para el cruce.' };
    }

    if (p1.isEgg || p2.isEgg) {
      return { success: false, message: 'Un huevo aún no puede reproducirse.' };
    }

    if (p1.level < 15 || p2.level < 15) {
      return { success: false, message: 'Ambos MagFams deben ser mínimo nivel 15 para acceder al Laboratorio de Crianza.' };
    }

    const fee = 150;
    const spendRes = await spendCurrency('MP', fee, 'MAGFAM_BREEDING', `Cruce genético en Paddock: ${p1.name} x ${p2.name}`);
    if (!spendRes.success) return { success: false, message: 'Saldo MP insuficiente para activar la matriz de cruce.' };

    playSoundEffect('hatch');

    const hybridElement = p1.element === p2.element ? p1.element : 'Cosmic';
    const newEgg: MagFamEnhancedCreature = {
      id: `egg-${Date.now()}`,
      name: name || `Huevo Híbrido ${hybridElement}`,
      nickname: 'Cría Cuántica',
      species: `Híbrido ${p1.species} + ${p2.species}`,
      rarity: 'ancestral',
      element: hybridElement,
      stage: 'egg',
      level: 1,
      experience: 0,
      maxExperience: 800,
      isEgg: true,
      hatchProgress: 0,
      hatchRequirement: 'Incubación completada al bañar y mimar el huevo.',
      bornTimestamp: new Date().toISOString(),
      status: 'normal',
      needs: {
        hunger: 100,
        happiness: 80,
        hygiene: 90,
        energy: 100,
        health: 100,
        discipline: 50,
      },
      hp: 10,
      maxHp: 10,
      combatStats: {
        vitality: Math.floor((p1.combatStats.vitality + p2.combatStats.vitality) / 2) + 15,
        power: Math.floor((p1.combatStats.power + p2.combatStats.power) / 2) + 10,
        wisdom: Math.floor((p1.combatStats.wisdom + p2.combatStats.wisdom) / 2) + 10,
        agility: Math.floor((p1.combatStats.agility + p2.combatStats.agility) / 2) + 10,
        intellect: Math.floor((p1.combatStats.intellect + p2.combatStats.intellect) / 2) + 10,
        prospecting: Math.floor((p1.combatStats.prospecting + p2.combatStats.prospecting) / 2) + 10,
        maxStatCap: 250,
      },
      diet: {
        lastFedTimestamp: new Date().toISOString(),
        mealsCount: 0,
        isOverfed: false,
        statusEffect: 'healthy',
        favoriteFood: p1.diet.favoriteFood,
      },
      imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      spriteState: 'idle',
      description: `Fruto genético de la resonancia armónica entre ${p1.name} y ${p2.name}. Hereda genes y bonificaciones aumentadas de ambas líneas.`,
      equippedAccessories: {},
      room: {
        wallpaper: 'furn-wall-nebula',
        flooring: 'furn-floor-hex',
        ambientLightColor: '#00f0ff',
        cleanliness: 100,
        placedItems: [],
      },
    };

    setCreatures((prev) => [newEgg, ...prev]);
    setActiveCreatureId(newEgg.id);
    return { success: true, message: `¡Cruce exitoso! Se ha generado un huevo legendario de elemento ${hybridElement}.` };
  };

  // 14. Hatch Egg
  const hatchActiveEgg = () => {
    if (!activeCreature.isEgg) return;
    playSoundEffect('hatch');

    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id !== activeCreature.id) return c;
        return {
          ...c,
          isEgg: false,
          stage: 'baby',
          hatchProgress: 100,
          status: 'happy',
          description: `¡Ha nacido un recién nacido de ${c.species}! Cuídalo y aliméntalo para desbloquear su potencial en MagnopVS.`,
        };
      })
    );
  };

  // 15. Calculate active combat player bonuses
  const totalDofusBonus: DofusCombatStats = {
    vitality: activeCreature.hp > 0 ? activeCreature.combatStats.vitality : 0,
    power: activeCreature.hp > 0 ? activeCreature.combatStats.power : 0,
    wisdom: activeCreature.hp > 0 ? activeCreature.combatStats.wisdom : 0,
    agility: activeCreature.hp > 0 ? activeCreature.combatStats.agility : 0,
    intellect: activeCreature.hp > 0 ? activeCreature.combatStats.intellect : 0,
    prospecting: activeCreature.hp > 0 ? activeCreature.combatStats.prospecting : 0,
    maxStatCap: activeCreature.combatStats.maxStatCap,
  };

  return (
    <MagFamContext.Provider
      value={{
        creatures,
        activeCreature,
        selectCreature,
        activeSubTab,
        setActiveSubTab,
        activeTool,
        setActiveTool,
        petCombo,
        tactilePetCreature,
        resetPetCombo,
        feedActiveCreature,
        washActiveCreature,
        petActiveCreature,
        toggleSleep,
        giveMedicine,
        disciplineCreature,
        resurrectCreature,
        foodInventory,
        buyFood,
        ownedAccessories,
        buyAccessory,
        equipAccessory,
        unequipAccessory,
        ownedFurniture,
        buyFurniture,
        placeFurnitureItem,
        removeFurnitureItem,
        changeWallpaper,
        changeFlooring,
        cleanRoom,
        completeMinigame,
        startExpedition,
        claimExpeditionReward,
        breedCreatures,
        hatchActiveEgg,
        totalDofusBonus,
      }}
    >
      {children}
    </MagFamContext.Provider>
  );
};

export const useMagFam = () => {
  const ctx = useContext(MagFamContext);
  if (!ctx) {
    throw new Error('useMagFam must be used within a MagFamProvider');
  }
  return ctx;
};
