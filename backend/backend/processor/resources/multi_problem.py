import math
import random
import re
import json
import openrouteservice
from openrouteservice import distance_matrix
from jmetal.core.problem import PermutationProblem
from jmetal.core.solution import PermutationSolution

from abc import ABC

class CVRP(PermutationProblem):
    """ Class representing TSP Problem. """

    #def __init__(self, instance: dict = None, instance2: dict = None):
    def __init__(self, instance: dict = None, number_objetives: int = None):
        super(CVRP, self).__init__()

        self.num_vehicles = len(instance["data_vehicles"])
        """It's not necessary to use all of them"""

        """ cost_matrix, cost_to_warehouse, demand_section, dimension, vehicle_capacity, depot_node = self.__read_from_file_cost(instance2)
        distance_matrix, distance_to_warehouse, dimension, vehicle_capacity, depot_node = self.__read_from_file_distance(instance) """
        distance_matrix, time_matrix, number_cities, distance_to_warehouse, vehicle_costs, vehicle_capacities, demand_section, dimension, fitnesses_to_evaluate, times_to_warehouse = self.__create_matrixes(instance)
        print("Number of objectives: ", number_objetives)
        print("Fitnesses to evaluate: ", fitnesses_to_evaluate)
        print("Distance matrix: ", distance_matrix)
        print("Demand section: ", demand_section)
        print("Time matrix: ", time_matrix)
        print("Distance to warehouse: ", distance_to_warehouse)
        print("Number of delivery points: ", dimension)
        print("Number of vehicles: ", self.num_vehicles)
        print("Vehicle capacity: ", vehicle_capacities)
        print("Vehicle costs: ", vehicle_costs)
        self.ficheiro1 = instance
        self.distance_matrix = distance_matrix
        self.time_matrix = time_matrix
        self.distance_to_warehouse = distance_to_warehouse
        self.vehicle_capacities = vehicle_capacities
        self.vehicle_costs = vehicle_costs
        self.demand_section = demand_section
        self.depot_node = [0]
        self.obj_directions = [self.MINIMIZE]
        self.fitnesses_to_evaluate = fitnesses_to_evaluate
        self.number_of_variables = dimension
        self.number_of_objectives = number_objetives
        self.number_of_constraints = 0
        self.times_to_warehouse = times_to_warehouse

    def __create_matrixes(self, data: dict):
        """
        Using API openrouteservice to calculate distance matrix
        """
        #print("Data nodes: ", data['data_nodes'])
        # Defining depot node
        #self.depot_node = [0]

        # Collecting coordinates
        coords = []
        for i in range(len(data['data_nodes'])):
            #print("Tuple: ", (node['latitude'], node['longitude']))
            latitude = float(data['data_nodes'][i]['latitude'])
            longitude = float(data['data_nodes'][i]['longitude'])
            coords.insert(i, (longitude, latitude))
        #print("Coordinates: ", coords)

        #Calling API --> distance and time matrix
        client = openrouteservice.Client(key='5b3ce3597851110001cf62483b6335326488469988f25ec7319aafb9') # Specify your personal API key
        response_json = client.distance_matrix(coords, metrics=['distance', 'duration'], units="km")
        matrix_distance = response_json['distances']
        matrix_time = response_json['durations']

        #Defining array with distances to warehouse --> not including warehouse 
        number_cities = len(data['data_nodes'])
        distances_to_warehouse = [-1] * (number_cities - 1)
        for i in range(number_cities - 1):
            distances_to_warehouse[i] = matrix_distance[i+1][0]
        #print(distances_to_warehouse)

        #Defining array with times to warehouse --> not including warehouse
        times_to_warehouse = [-1] * (number_cities - 1)
        for i in range(number_cities - 1):
            times_to_warehouse[i] = matrix_time[i+1][0]

        #Defining cost array from vehicle
        number_of_cars = len(data['data_vehicles'])
        vehicle_costs = [-1] * (number_of_cars)
        for i in range(number_of_cars):
            cost = float(data['data_vehicles'][i]['cost'])
            vehicle_costs[i] = cost
        
        #Defining capacity array from vehicle
        vehicle_capacity = [-1] * (number_of_cars)
        for i in range(number_of_cars):
            capacity = float(data['data_vehicles'][i]['capacity'])
            vehicle_capacity[i] = capacity

        #Defining demanding array from each delivery point
        number_delivery_points = number_cities - 1
        demand_section = [-1] * (number_delivery_points)
        for i in range(number_delivery_points):
            demand = float(data['data_nodes'][i+1]['demand'])
            demand_section[i] = demand

        #Defining fitnesses that will be evaluated
        optimization_array = data['optimization']
        #print("OPTIMIZATION ARRAY: ", optimization_array)
        fitnesses_to_evaluate = []
        for i in range(len(optimization_array)):
            if optimization_array[i] == 1:
                fitnesses_to_evaluate.append("fitness" + str(i +1))

        return matrix_distance, matrix_time, number_cities, distances_to_warehouse, vehicle_costs, vehicle_capacity, demand_section, number_delivery_points, fitnesses_to_evaluate, times_to_warehouse

    def __read_from_file_distance(self, data: dict):
        vehicle_capacity = int(data["capacity"])
        dimension = int(data["dimension"])

        #delivery_points
        delivery_points_x = [-1] * (dimension - 1)
        delivery_points_y = [-1] * (dimension - 1)
        depot_x = 0
        depot_y = 0
        depot_node = 1
        
        for item in data["data"]:
            j = int(item["node"])
            if item["node"] == "1":
                """origin x"""
                depot_x = int(item["latitude"])
                """origin y"""
                depot_y = int(item["longitude"])
                """depot node"""
                depot_node = int(item["node"])
            else:
                delivery_points_x[j-2] = int(item["latitude"])
                delivery_points_y[j-2] = int(item["longitude"])

        distance_matrix = [[-1] * (dimension - 1) for _ in range(dimension - 1)]
        for k in range(dimension - 1):
            distance_matrix[k][k] = 0
            for j in range(dimension - 1):
                dist = math.sqrt((delivery_points_x[k] - delivery_points_x[j]) ** 2 + (delivery_points_y[k] - delivery_points_y[j]) ** 2)
                dist = round(dist)
                distance_matrix[k][j] = dist
                distance_matrix[j][k] = dist

        distance_to_warehouse =  [-1] * (dimension - 1)
        """distance_to_warehouse[k] = 0"""
        for j in range(dimension - 1):
            dist = math.sqrt((depot_x - delivery_points_x[j]) ** 2 + (depot_y - delivery_points_y[j]) ** 2)
            dist = round(dist)
            distance_to_warehouse[j] = dist

        return distance_matrix, distance_to_warehouse, len(delivery_points_x), vehicle_capacity, depot_node

    def __read_from_file_cost(self, data: dict):
        vehicle_capacity = int(data["capacity"])
        dimension = int(data["dimension"])

        delivery_points_x = [-1] * (dimension - 1)
        delivery_points_y = [-1] * (dimension - 1)
        depot_x = 0
        depot_y = 0
        depot_node = 0
        for item in data["data"]:
            j = int(item["node"])
            if item["node"] == "1":
                """origin x"""
                depot_x = int(item["latitude"])
                """origin y"""
                depot_y = int(item["longitude"])
                """depot node"""
                depot_node = int(item["node"])
            else:
                delivery_points_x[j-2] = int(item["latitude"])
                delivery_points_y[j-2] = int(item["longitude"])

        distance_matrix = [[-1] * (dimension - 1) for _ in range(dimension - 1)]
        for k in range(dimension - 1):
            distance_matrix[k][k] = 0
            for j in range(dimension - 1):
                dist = math.sqrt((delivery_points_x[k] - delivery_points_x[j]) ** 2 + (delivery_points_y[k] - delivery_points_y[j]) ** 2)
                dist = round(dist)
                distance_matrix[k][j] = dist
                distance_matrix[j][k] = dist

        distance_to_warehouse =  [-1] * (dimension - 1)
        """distance_to_warehouse[k] = 0"""
        for j in range(dimension - 1):
            dist = math.sqrt((depot_x - delivery_points_x[j]) ** 2 + (depot_y - delivery_points_y[j]) ** 2)
            dist = round(dist)
            distance_to_warehouse[j] = dist

        demand_section = [-1] * (dimension - 1)
        demand_section[0] = 0
        for item in data["data"]:
            if item["node"] != "1":
                j = int(item["node"])
                demand_section[j-2] = int(item["demand"])

        return distance_matrix, distance_to_warehouse, demand_section, len(delivery_points_x), vehicle_capacity, depot_node



    def evaluate(self, solution: PermutationSolution) -> PermutationSolution:
        fitness1 = 0 #distance
        fitness2 = 0 #cost
        fitness3 = 0 #tempo
        fitness4 = 0 #veiculos

        matrix_route = []
        sub_route = []

        #Creating matrix with subroutes of each vehicle
        for i in range(len(solution.variables)):
            node = solution.variables[i]
            if i == 0 and node < 0:
                matrix_route.append([])
            elif node > 0: # nó positivo --> append subroute
                #print("Appending to sub_route: ", node)
                sub_route.append(node)
            else: # nó negativo --> append matrix
                #print("Appending subroute: ", sub_route)
                matrix_route.append(sub_route)
                sub_route = []

        matrix_route.append(sub_route)
        
        #Get the order of the vehicles 
        #cars_that_exists = range(1, self.num_vehicles + 1)
        #cars_list = [ -x for x in cars_that_exists]
        #cars = list(filter(lambda x: x < 0, solution.variables))
        #for car in cars_list:
        #    if car not in cars:
        #        cars.insert(0,car)
        #        break

        #Starting to evaluate sub routes of each vehicle
        index_car = 0
        for sub_route in matrix_route:
            car = index_car
            #index_sub_route = 0
            #print("Vou analisar sub rota: ", sub_route)
            route_demand = 0
            number_nodes = len(sub_route)
            if number_nodes == 0: # sub_route -> []
                index_car += 1
                continue
            elif number_nodes == 1: # sub_route -> [9]
                x = sub_route[0]
                route_demand += self.demand_section[x-1]
                distance_to_warehouse = self.distance_to_warehouse[x-1] * 2
                fitness1 += distance_to_warehouse
                fitness2 += distance_to_warehouse * self.vehicle_costs[car]
                time_compare = self.times_to_warehouse[x-1] * 2
                if time_compare > fitness3:
                    fitness3 = time_compare

                if route_demand > self.vehicle_capacities[car]:
                    fitness1 += 99999999
                    fitness2 += 99999999
                    print("Surpassed capacity")
                index_car += 1
                fitness4 += 1
            else: # sub_route -> [9,4,5] // [9,4] 
                time_compare = 0
                for i in range(len(sub_route) - 1):
                    x = sub_route[i]
                    y = sub_route[i + 1]
                    
                    if i == 0:
                        distance_to_warehouse = self.distance_to_warehouse[x-1]
                        fitness1 += distance_to_warehouse   
                        fitness2 += distance_to_warehouse * self.vehicle_costs[car]
                        time_compare += self.times_to_warehouse[x-1]
                        route_demand += self.demand_section[x-1]
                    route_demand = self.demand_section[y-1]
                    if route_demand > self.vehicle_capacities[car]:
                            fitness1 += 99999999
                            fitness2 += 99999999
                            fitness3 += 99999999
                    fitness1 += self.distance_matrix[x][y]
                    fitness2 += self.distance_matrix[x][y] * self.vehicle_costs[car]
                    time_compare += self.time_matrix[x][y]

                if time_compare > fitness3:
                    fitness3 = time_compare
                fitness4 += 1
                index_car += 1

        #Atribuir os fitnesses aos objetivos
        for i in range(len(self.fitnesses_to_evaluate)):
            if self.fitnesses_to_evaluate[i] == "fitness1":
                print("Using fitness1")
                solution.objectives[i] = fitness1
            if self.fitnesses_to_evaluate[i] == "fitness2":
                print("Using fitness2")
                solution.objectives[i] = fitness2
            if self.fitnesses_to_evaluate[i] == "fitness3":
                print("Using fitness3")
                solution.objectives[i] = fitness3
            if self.fitnesses_to_evaluate[i] == "fitness4":
                print("Using fitness4")
                solution.objectives[i] = fitness4
        
        #solution.objectives[0] = fitness1
        #solution.objectives[1] = fitness2

        return solution


    def create_solution(self) -> PermutationSolution:
        new_solution = PermutationSolution(number_of_variables=self.number_of_variables,
                                           number_of_objectives=self.number_of_objectives)

        #destination = [self.number_of_variables]
        #random.seed(1)
        #new_solution.variables = random.sample(range(2,self.number_of_variables), k=self.number_of_variables - 1)
        
        random_nodes = random.sample(range(1,self.number_of_variables+1), k=self.number_of_variables)
        cars_to_add = self.num_vehicles - 1
        random_cars = random.sample(range(1, self.num_vehicles+1), k=cars_to_add)
        for i in range(cars_to_add):
            dummy_node = i + 1
            random_nodes.append(-dummy_node)

        random.shuffle(random_nodes)

        new_solution.variables = random_nodes
        #print(random_nodes)
        return new_solution


    @property
    def number_of_cities(self):
        return self.number_of_variables

    def get_name(self):
        return 'CVRP'