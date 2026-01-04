import networkx as nx

class CPMEngine:
    def __init__(self, tasks, dependencies):
        """
        tasks: List of dicts or objects with 'id', 'duration'
        dependencies: List of dicts or objects with 'predecessor_id', 'successor_id', 'lag'
        """
        self.tasks = {t['id']: t for t in tasks}
        self.dependencies = dependencies
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        # Add nodes
        for t_id in self.tasks:
            self.graph.add_node(t_id, duration=self.tasks[t_id]['duration'])
        
        # Add edges with attributes
        for dep in self.dependencies:
            self.graph.add_edge(
                dep['predecessor_id'], 
                dep['successor_id'], 
                lag=dep.get('lag', 0),
                type=dep.get('type', 'FS')
            )

    def calculate(self):
        if not nx.is_directed_acyclic_graph(self.graph):
            raise ValueError("Circular dependency detected in project tasks.")

        # Topological sort ensures we process in valid dependency order
        topo_order = list(nx.topological_sort(self.graph))
        
        # --- Forward Pass (Calculate Early Start & Early Finish) ---
        # Initialize ES and EF
        MAX_PROJECT_DURATION = 0
        computed = {
            tid: {'ES': 0, 'EF': 0, 'LS': 0, 'LF': 0, 'Float': 0, 'IsCritical': False} 
            for tid in self.tasks
        }

        for t_id in topo_order:
            duration = self.tasks[t_id]['duration']
            
            # Find max Early Finish of all predecessors + Lag
            max_prey_ef = 0
            in_edges = self.graph.in_edges(t_id, data=True)
            
            for pred, _, data in in_edges:
                pred_ef = computed[pred]['EF']
                lag = data.get('lag', 0)
                # Assuming Finish-to-Start (FS) for simplicity as base case
                # ES = max(Predecessor EF + Lag)
                if pred_ef + lag > max_prey_ef:
                    max_prey_ef = pred_ef + lag
            
            computed[t_id]['ES'] = max_prey_ef
            computed[t_id]['EF'] = max_prey_ef + duration
            
            if computed[t_id]['EF'] > MAX_PROJECT_DURATION:
                MAX_PROJECT_DURATION = computed[t_id]['EF']

        # --- Backward Pass (Calculate Late Start & Late Finish) ---
        # Initialize LF to Project Duration for end nodes
        # We traverse in reverse topological order
        
        # Set initial LF for all tasks to Max Duration (or logic to valid terminals)
        # Actually, for the backward pass, we usually start from the sink nodes or set all to max first.
        for t_id in computed:
            computed[t_id]['LF'] = MAX_PROJECT_DURATION
            computed[t_id]['LS'] = MAX_PROJECT_DURATION - self.tasks[t_id]['duration']

        for t_id in reversed(topo_order):
            duration = self.tasks[t_id]['duration']
            
            out_edges = self.graph.out_edges(t_id, data=True)
            out_edges_list = list(out_edges)
            
            if not out_edges_list:
                # If it's a sink node (no successors), its LF is the project duration
                # (Already set above, but confirming logic)
                computed[t_id]['LF'] = MAX_PROJECT_DURATION
            else:
                # LF = min(Successor LS - Lag)
                min_succ_ls = float('inf')
                for _, succ, data in out_edges_list:
                    succ_ls = computed[succ]['LS']
                    lag = data.get('lag', 0)
                    val = succ_ls - lag
                    if val < min_succ_ls:
                        min_succ_ls = val
                
                computed[t_id]['LF'] = min_succ_ls
            
            computed[t_id]['LS'] = computed[t_id]['LF'] - duration

        # --- Calculate Float & Critical Path ---
        for t_id in computed:
            total_float = computed[t_id]['LS'] - computed[t_id]['ES']
            # Floating point issues can rarely happen, round to generic int logic if days are ints
            computed[t_id]['Float'] = total_float
            if total_float <= 0:
                computed[t_id]['IsCritical'] = True
                computed[t_id]['Float'] = 0 # Normalize negative zero or small errors

        return computed

# Example usage helper
def run_cpm_analysis(tasks_db, dependencies_db):
    """
    Adapter to run the engine with DB objects
    """
    task_list = [{'id': t.id, 'duration': t.duration} for t in tasks_db]
    dep_list = [{'predecessor_id': d.predecessor_id, 
                 'successor_id': d.successor_id, 
                 'lag': d.lag} for d in dependencies_db]
    
    engine = CPMEngine(task_list, dep_list)
    return engine.calculate()
