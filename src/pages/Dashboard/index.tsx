import { useEffect, useState } from 'react';

import Food from '../../components/Food';
import Header from '../../components/Header';

import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import api from '../../services/api';

import IFoodDTO from '../../dtos/IFoodDTO';

import { FoodsContainer } from './styles';

export function Dashboard() {
  const [foods, setFoods] = useState<IFoodDTO[]>([]);

  const [editingFood, setEditingFood] = useState<IFoodDTO>({} as IFoodDTO);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  function toggleModal() {
    setModalOpen(prevState => !prevState);
  }

  function toggleEditModal() {
    setEditModalOpen(prevState => !prevState);
  }

  async function handleAddFood(food: IFoodDTO) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods(prevState => [...prevState, response.data]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateFood(food: IFoodDTO) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);
      
      setFoods(foodsFiltered);
    } catch (error) {
      console.error(error);
    }
  }

  function handleEditFood(food: IFoodDTO) {
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard;
