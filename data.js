// ============================================================
//  K8s Playground — Data Layer
// ============================================================

const COMMANDS = [
  // ---- BASICS ----
  { id: 'b1', category: 'basics', title: 'Get cluster info', cmd: 'kubectl cluster-info', desc: 'Display endpoint info for the master and cluster services.' },
  { id: 'b2', category: 'basics', title: 'Get all nodes', cmd: 'kubectl get nodes', desc: 'List all nodes in the cluster with their status and roles.' },
  { id: 'b3', category: 'basics', title: 'Get nodes wide', cmd: 'kubectl get nodes -o wide', desc: 'List nodes with additional info: IP, OS, kernel version, container runtime.' },
  { id: 'b4', category: 'basics', title: 'Get all namespaces', cmd: 'kubectl get namespaces', desc: 'List all namespaces in the cluster.' },
  { id: 'b5', category: 'basics', title: 'Set context namespace', cmd: 'kubectl config set-context --current --namespace=<ns>', desc: 'Set the default namespace for the current context.' },
  { id: 'b6', category: 'basics', title: 'View kubeconfig', cmd: 'kubectl config view', desc: 'Display merged kubeconfig settings.' },
  { id: 'b7', category: 'basics', title: 'Switch context', cmd: 'kubectl config use-context <context-name>', desc: 'Switch between clusters/contexts in kubeconfig.' },
  { id: 'b8', category: 'basics', title: 'Get all resources', cmd: 'kubectl get all -n <namespace>', desc: 'List all resource types (pods, svc, deploy, rs) in a namespace.' },
  // ---- PODS ----
  { id: 'p1', category: 'pods', title: 'List pods', cmd: 'kubectl get pods', desc: 'List all pods in the current namespace.' },
  { id: 'p2', category: 'pods', title: 'List pods all namespaces', cmd: 'kubectl get pods --all-namespaces', desc: 'List pods across all namespaces.' },
  { id: 'p3', category: 'pods', title: 'Describe a pod', cmd: 'kubectl describe pod <pod-name>', desc: 'Show detailed state, events, and conditions of a pod.' },
  { id: 'p4', category: 'pods', title: 'Pod logs', cmd: 'kubectl logs <pod-name>', desc: 'Fetch and stream logs from a container in a pod.' },
  { id: 'p5', category: 'pods', title: 'Follow pod logs', cmd: 'kubectl logs -f <pod-name>', desc: 'Stream (tail) logs from a pod in real time.' },
  { id: 'p6', category: 'pods', title: 'Exec into pod', cmd: 'kubectl exec -it <pod-name> -- /bin/bash', desc: 'Open an interactive shell inside a running container.' },
  { id: 'p7', category: 'pods', title: 'Delete a pod', cmd: 'kubectl delete pod <pod-name>', desc: 'Delete a specific pod; the controller may recreate it.' },
  { id: 'p8', category: 'pods', title: 'Run a pod', cmd: 'kubectl run nginx --image=nginx', desc: 'Run a pod with a specified image (imperative).' },
  { id: 'p9', category: 'pods', title: 'Pod resource usage', cmd: 'kubectl top pod <pod-name>', desc: 'Display CPU/memory usage of a pod (requires Metrics Server).' },
  { id: 'p10', category: 'pods', title: 'Copy files from pod', cmd: 'kubectl cp <pod>:/path/to/file ./local-file', desc: 'Copy files from a container to local filesystem or vice versa.' },
  // ---- DEPLOYMENTS ----
  { id: 'd1', category: 'deployments', title: 'List deployments', cmd: 'kubectl get deployments', desc: 'List all deployments in the current namespace.' },
  { id: 'd2', category: 'deployments', title: 'Create deployment', cmd: 'kubectl create deployment myapp --image=nginx', desc: 'Create a deployment with the specified image.' },
  { id: 'd3', category: 'deployments', title: 'Scale deployment', cmd: 'kubectl scale deployment myapp --replicas=5', desc: 'Scale a deployment to a desired number of replicas.' },
  { id: 'd4', category: 'deployments', title: 'Rollout status', cmd: 'kubectl rollout status deployment/myapp', desc: 'Watch the rollout status of a deployment.' },
  { id: 'd5', category: 'deployments', title: 'Rollout history', cmd: 'kubectl rollout history deployment/myapp', desc: 'View the revision history of a deployment.' },
  { id: 'd6', category: 'deployments', title: 'Rollback deployment', cmd: 'kubectl rollout undo deployment/myapp', desc: 'Rollback to the previous deployment revision.' },
  { id: 'd7', category: 'deployments', title: 'Update image', cmd: 'kubectl set image deployment/myapp nginx=nginx:1.21', desc: 'Update the container image of a deployment.' },
  { id: 'd8', category: 'deployments', title: 'Autoscale', cmd: 'kubectl autoscale deployment myapp --min=2 --max=10 --cpu-percent=80', desc: 'Create a HorizontalPodAutoscaler for a deployment.' },
  { id: 'd9', category: 'deployments', title: 'Pause rollout', cmd: 'kubectl rollout pause deployment/myapp', desc: 'Pause an ongoing rollout to make multiple changes.' },
  { id: 'd10', category: 'deployments', title: 'Resume rollout', cmd: 'kubectl rollout resume deployment/myapp', desc: 'Resume a paused deployment rollout.' },
  // ---- SERVICES ----
  { id: 's1', category: 'services', title: 'List services', cmd: 'kubectl get services', desc: 'List all services and their cluster IPs and ports.' },
  { id: 's2', category: 'services', title: 'Expose deployment', cmd: 'kubectl expose deployment myapp --port=80 --type=LoadBalancer', desc: 'Create a service to expose a deployment externally.' },
  { id: 's3', category: 'services', title: 'Describe service', cmd: 'kubectl describe service <svc-name>', desc: 'Show detailed info about a service including endpoints.' },
  { id: 's4', category: 'services', title: 'Port forward', cmd: 'kubectl port-forward svc/myapp 8080:80', desc: 'Forward local port 8080 to service port 80 for debugging.' },
  { id: 's5', category: 'services', title: 'Get endpoints', cmd: 'kubectl get endpoints', desc: 'List all endpoints (pod IPs backing services).' },
  { id: 's6', category: 'services', title: 'Delete service', cmd: 'kubectl delete svc <svc-name>', desc: 'Remove a service resource from the cluster.' },
  // ---- CONFIG ----
  { id: 'c1', category: 'config', title: 'Create ConfigMap', cmd: 'kubectl create configmap my-config --from-literal=key=value', desc: 'Create a ConfigMap from a key-value literal.' },
  { id: 'c2', category: 'config', title: 'ConfigMap from file', cmd: 'kubectl create configmap my-config --from-file=app.properties', desc: 'Create a ConfigMap from a file.' },
  { id: 'c3', category: 'config', title: 'Create Secret', cmd: 'kubectl create secret generic my-secret --from-literal=password=s3cr3t', desc: 'Create a generic Kubernetes Secret.' },
  { id: 'c4', category: 'config', title: 'Get secrets', cmd: 'kubectl get secrets', desc: 'List all secrets in the namespace.' },
  { id: 'c5', category: 'config', title: 'Decode secret', cmd: 'kubectl get secret my-secret -o jsonpath="{.data.password}" | base64 -d', desc: 'Decode a base64-encoded secret value.' },
  { id: 'c6', category: 'config', title: 'Apply manifest', cmd: 'kubectl apply -f manifest.yaml', desc: 'Apply a configuration file to create/update resources.' },
  { id: 'c7', category: 'config', title: 'Dry run apply', cmd: 'kubectl apply -f manifest.yaml --dry-run=client', desc: 'Preview what would be created without actually applying.' },
  // ---- STORAGE ----
  { id: 'st1', category: 'storage', title: 'List PVs', cmd: 'kubectl get pv', desc: 'List all PersistentVolumes in the cluster.' },
  { id: 'st2', category: 'storage', title: 'List PVCs', cmd: 'kubectl get pvc', desc: 'List all PersistentVolumeClaims in the namespace.' },
  { id: 'st3', category: 'storage', title: 'Describe PVC', cmd: 'kubectl describe pvc <pvc-name>', desc: 'Show binding status, capacity, and access modes of a PVC.' },
  { id: 'st4', category: 'storage', title: 'Storage classes', cmd: 'kubectl get storageclass', desc: 'List available storage classes in the cluster.' },
  // ---- RBAC ----
  { id: 'r1', category: 'rbac', title: 'List roles', cmd: 'kubectl get roles -n <namespace>', desc: 'List Roles within a namespace.' },
  { id: 'r2', category: 'rbac', title: 'List cluster roles', cmd: 'kubectl get clusterroles', desc: 'List ClusterRoles (non-namespaced).' },
  { id: 'r3', category: 'rbac', title: 'Auth can-i', cmd: 'kubectl auth can-i create pods --as=dev-user', desc: 'Check whether an action is allowed for a user.' },
  { id: 'r4', category: 'rbac', title: 'List service accounts', cmd: 'kubectl get serviceaccounts', desc: 'List service accounts in the current namespace.' },
  { id: 'r5', category: 'rbac', title: 'Create role binding', cmd: 'kubectl create rolebinding dev-rb --role=developer --user=dev-user', desc: 'Bind a Role to a user within a namespace.' },
  // ---- DEBUGGING ----
  { id: 'db1', category: 'debugging', title: 'Get events', cmd: 'kubectl get events --sort-by=.metadata.creationTimestamp', desc: 'List recent cluster events sorted by time.' },
  { id: 'db2', category: 'debugging', title: 'Describe node', cmd: 'kubectl describe node <node-name>', desc: 'Show node conditions, capacity, allocatable resources, and events.' },
  { id: 'db3', category: 'debugging', title: 'Debug pod copy', cmd: 'kubectl debug -it <pod> --image=busybox --copy-to=debug-pod', desc: 'Create a copy of a crashed pod for debugging.' },
  { id: 'db4', category: 'debugging', title: 'Resource usage nodes', cmd: 'kubectl top nodes', desc: 'Display CPU/memory consumption of all nodes.' },
  { id: 'db5', category: 'debugging', title: 'JSON output', cmd: 'kubectl get pod <pod-name> -o json', desc: 'Get the full JSON representation of a resource.' },
  { id: 'db6', category: 'debugging', title: 'JSONPath query', cmd: 'kubectl get pods -o jsonpath="{.items[*].metadata.name}"', desc: 'Extract specific fields using JSONPath expressions.' },
  { id: 'db7', category: 'debugging', title: 'Label selector', cmd: 'kubectl get pods -l app=nginx', desc: 'Filter resources by label selector.' },
];

// ---- QUIZ QUESTIONS ----
const QUIZ_QUESTIONS = [
  // Beginner
  { q: 'What is a Pod in Kubernetes?', opts: ['A virtual machine', 'The smallest deployable unit in K8s, containing one or more containers', 'A network policy', 'A storage class'], ans: 1, diff: 'beginner', exp: 'A Pod is the atomic unit of K8s. It hosts one or more containers that share network and storage. Pods are ephemeral by nature.' },
  { q: 'Which command lists all pods in all namespaces?', opts: ['kubectl get pods -a', 'kubectl get pods --all-namespaces', 'kubectl list pods --global', 'kubectl describe pods'], ans: 1, diff: 'beginner', exp: '"--all-namespaces" (or -A) shows pods across every namespace in the cluster.' },
  { q: 'What does etcd store in Kubernetes?', opts: ['Container images', 'Application logs', 'All cluster state and configuration data', 'Network routes'], ans: 2, diff: 'beginner', exp: 'etcd is a distributed key-value store that acts as the single source of truth for the entire cluster state, including all resource definitions.' },
  { q: 'What is the role of the kube-scheduler?', opts: ['Manages container networking', 'Assigns Pods to Nodes', 'Stores cluster state', 'Handles HTTP requests'], ans: 1, diff: 'beginner', exp: 'The scheduler watches for newly created pods with no assigned node and selects the best node based on resource requirements and constraints.' },
  { q: 'Which object ensures a specified number of pod replicas are running?', opts: ['StatefulSet', 'DaemonSet', 'ReplicaSet', 'Job'], ans: 2, diff: 'beginner', exp: 'A ReplicaSet maintains a stable set of replica Pods running at any given time. Deployments manage ReplicaSets.' },
  { q: 'What does "kubectl apply -f" do?', opts: ['Deletes a resource', 'Creates or updates resources from a manifest file', 'Scales a deployment', 'Restarts pods'], ans: 1, diff: 'beginner', exp: '"kubectl apply" is declarative — it creates the resource if it does not exist, or updates it to match the desired state in the file.' },
  { q: 'What is a Namespace in Kubernetes?', opts: ['A physical server', 'A virtual cluster for resource isolation', 'A container registry', 'A network plugin'], ans: 1, diff: 'beginner', exp: 'Namespaces provide a mechanism for isolating groups of resources within a single cluster — useful for multi-team environments.' },
  { q: 'Which component runs on every worker node?', opts: ['etcd', 'API Server', 'kubelet', 'Scheduler'], ans: 2, diff: 'beginner', exp: 'kubelet is an agent that runs on each node. It ensures that containers in a Pod are running and healthy according to the PodSpec.' },
  // Intermediate
  { q: 'What is the difference between a Deployment and a StatefulSet?', opts: ['No difference', 'StatefulSets give Pods stable identities/storage; Deployments treat Pods as interchangeable', 'Deployments can only run one replica', 'StatefulSets cannot scale'], ans: 1, diff: 'intermediate', exp: 'StatefulSets provide stable network IDs, persistent storage, and ordered deployment/termination — essential for databases like Cassandra or MongoDB.' },
  { q: 'How does a Kubernetes Service of type ClusterIP differ from NodePort?', opts: ['ClusterIP is external, NodePort is internal', 'ClusterIP is internal-only; NodePort exposes the service on each node\'s IP at a static port', 'They are identical', 'ClusterIP does not perform load balancing'], ans: 1, diff: 'intermediate', exp: 'ClusterIP: only reachable within the cluster. NodePort: adds a static port (30000-32767) on each Node\'s IP, making it reachable externally.' },
  { q: 'What is a DaemonSet used for?', opts: ['Running a batch job', 'Ensuring exactly one Pod runs on every (or selected) node', 'Managing stateful applications', 'Autoscaling pods'], ans: 1, diff: 'intermediate', exp: 'DaemonSets are perfect for cluster-wide daemons like log collectors (Fluentd), monitoring agents (Datadog), or network plugins running on every node.' },
  { q: 'What does kubectl rollout undo do?', opts: ['Pauses the deployment', 'Scales replicas to zero', 'Reverts to the previous known-good deployment revision', 'Deletes the deployment'], ans: 2, diff: 'intermediate', exp: '"rollout undo" triggers a rollback to the previous revision. You can also specify --to-revision=N to roll back to a specific version.' },
  { q: 'What is a Liveness Probe?', opts: ['A metric for CPU usage', 'A check to decide if a container should be restarted', 'A network health check', 'A storage probe'], ans: 1, diff: 'intermediate', exp: 'Liveness probes detect when a container is stuck. If the probe fails, kubelet kills and restarts the container. Readiness probes control traffic routing.' },
  { q: 'What is a PersistentVolumeClaim (PVC)?', opts: ['A physical disk', 'A request for storage by a user/pod', 'A storage class', 'A network volume'], ans: 1, diff: 'intermediate', exp: 'A PVC is a request for a PersistentVolume (PV). It specifies size, access mode, and optionally a StorageClass. K8s binds the PVC to a suitable PV.' },
  { q: 'What does the HorizontalPodAutoscaler (HPA) use by default?', opts: ['Memory pressure', 'Custom metrics', 'CPU utilization', 'Node count'], ans: 2, diff: 'intermediate', exp: 'By default HPA scales based on CPU utilization. From K8s 1.6+ it also supports custom metrics (e.g., requests/sec via the Custom Metrics API).' },
  { q: 'What is the purpose of a ResourceQuota?', opts: ['Network throttling', 'Limits total resource consumption per namespace', 'Sets container CPU limits', 'Manages storage classes'], ans: 1, diff: 'intermediate', exp: 'ResourceQuotas constrain aggregate resource usage (CPU, memory, object counts) in a namespace, preventing any one team from consuming all cluster resources.' },
  // Advanced
  { q: 'What is the difference between a NetworkPolicy "Ingress" and "Egress" rule?', opts: ['They are the same', 'Ingress controls inbound traffic to a pod; Egress controls outbound traffic from a pod', 'Ingress is for HTTP only', 'Egress applies only to nodes'], ans: 1, diff: 'advanced', exp: 'NetworkPolicy Ingress rules restrict which sources can send traffic TO pods. Egress rules restrict where pods can SEND traffic. Both must be opened for bidirectional communication.' },
  { q: 'In RBAC, what is the difference between a Role and a ClusterRole?', opts: ['No difference', 'Role is namespaced; ClusterRole is cluster-wide', 'ClusterRole can only be bound to service accounts', 'Role applies to all namespaces'], ans: 1, diff: 'advanced', exp: 'Role grants permissions within a specific namespace. ClusterRole grants cluster-wide permissions or can be reused across namespaces via RoleBindings.' },
  { q: 'What is a PodDisruptionBudget (PDB)?', opts: ['A cost limit for pods', 'Guarantees minimum availability during voluntary disruptions', 'A CPU quota', 'A network policy'], ans: 1, diff: 'advanced', exp: 'PDB ensures that a minimum number (or percentage) of pods in a deployment remain available during voluntary disruptions like draining a node for maintenance.' },
  { q: "What is the K8s control loop (reconciliation loop)?", opts: ['A logging pattern', 'The process where controllers watch desired state and reconcile with actual state', 'A pod restart policy', 'A network routing mechanism'], ans: 1, diff: 'advanced', exp: 'Controllers continuously watch the API server for their resource type. When actual state diverges from desired state, they act to reconcile — core to K8s\'s self-healing.' },
  { q: 'What does setting requests vs limits on a container do?', opts: ['They are identical', 'requests = guaranteed resources for scheduling; limits = maximum the container can use', 'requests are CPU only', 'limits prevent node overcommit'], ans: 1, diff: 'advanced', exp: 'requests: used by the scheduler to find a node with enough capacity. limits: enforced at runtime — CPU is throttled, memory OOM kills the container if exceeded.' },
  { q: 'What is the purpose of init containers?', opts: ['They replace the main container', 'They run to completion before app containers start, used for setup tasks', 'They manage sidecars', 'They provide health checks'], ans: 1, diff: 'advanced', exp: 'Init containers run serially before the main container. Used for pre-conditions like waiting for a DB, seeding data, or downloading configs. Unlike sidecars they terminate.' },
  { q: 'What is a CRD (Custom Resource Definition)?', opts: ['A container runtime', 'An extension mechanism to define new resource types in the K8s API', 'A deployment strategy', 'A storage plugin'], ans: 1, diff: 'advanced', exp: 'CRDs extend the K8s API by defining new resource types. Combined with a custom controller (operator), they enable managing complex stateful applications natively.' },
];

// ---- INTERVIEW Q&A ----
const INTERVIEW_QA = [
  // FUNDAMENTALS
  { q: 'Explain the Kubernetes architecture and its key components.', a: `Kubernetes has two main planes:<br/><br/><strong>Control Plane (Master):</strong><ul><li><code>kube-apiserver</code> — single entry point; all communication goes through it</li><li><code>etcd</code> — distributed key-value store holding all cluster state</li><li><code>kube-scheduler</code> — assigns pods to nodes based on resources/constraints</li><li><code>kube-controller-manager</code> — runs controllers (Deployment, ReplicaSet, Node, etc.)</li><li><code>cloud-controller-manager</code> — integrates with cloud provider APIs</li></ul><strong>Worker Nodes:</strong><ul><li><code>kubelet</code> — agent ensuring pods run as specified</li><li><code>kube-proxy</code> — manages iptables/IPVS rules for service networking</li><li>Container runtime (containerd, CRI-O) — runs containers</li></ul>`, cat: 'fundamentals', level: 'beginner' },
  { q: 'What is the difference between Deployment, StatefulSet, DaemonSet, and Job?', a: `<ul><li><strong>Deployment</strong>: Stateless apps, rolling updates, interchangeable pods (web servers, APIs)</li><li><strong>StatefulSet</strong>: Stateful apps with stable pod identity, ordered scaling, persistent storage (databases, Kafka)</li><li><strong>DaemonSet</strong>: Runs exactly one Pod per node — for cluster-level services (log agents, monitoring)</li><li><strong>Job</strong>: Runs pods to completion for batch tasks. CronJob schedules Jobs on a time-based schedule</li></ul>`, cat: 'fundamentals', level: 'beginner' },
  { q: 'How does Kubernetes ensure high availability?', a: `HA in K8s involves:<ul><li><strong>Multiple control plane nodes</strong>: API servers behind a load balancer, etcd cluster (minimum 3 nodes for quorum)</li><li><strong>ReplicaSets/Deployments</strong>: Maintain desired pod count; reschedule failed pods</li><li><strong>Node affinity/anti-affinity</strong>: Spread pods across zones/nodes</li><li><strong>PodDisruptionBudgets</strong>: Prevent too many pods being killed simultaneously</li><li><strong>Liveness/Readiness probes</strong>: Automatic restart of unhealthy containers</li><li><strong>Horizontal Pod Autoscaler</strong>: Scale out under load</li></ul>`, cat: 'fundamentals', level: 'intermediate' },
  { q: 'What is the Kubernetes control loop / reconciliation loop?', a: `The <strong>reconciliation loop</strong> is the core principle behind Kubernetes. Every controller watches the desired state (stored in etcd via API server) and the actual current state of resources.<br/><br/>If the actual state differs from desired state, the controller takes action to reconcile them. For example:<ul><li>A Deployment controller sees 3 desired replicas but only 2 running → creates a new pod</li><li>A Node controller detects a node is unresponsive → marks it NotReady, evicts pods</li></ul>This is why K8s is <em>self-healing</em> — it continuously drives toward the desired state.`, cat: 'fundamentals', level: 'intermediate' },
  { q: 'Explain rolling updates and how to roll back a deployment.', a: `A <strong>rolling update</strong> gradually replaces old pods with new ones without downtime.<br/><br/>Key parameters:<pre>strategy:\n  type: RollingUpdate\n  rollingUpdate:\n    maxSurge: 1        # extra pods above desired\n    maxUnavailable: 0  # pods that can be offline</pre>Rollback:<pre>kubectl rollout undo deployment/myapp\n# or to specific revision:\nkubectl rollout undo deployment/myapp --to-revision=2</pre>K8s keeps revision history (controlled by <code>revisionHistoryLimit</code>).`, cat: 'fundamentals', level: 'intermediate' },
  // NETWORKING
  { q: 'How does Kubernetes networking work? Explain the CNI.', a: `K8s networking follows these rules:<ul><li>Every Pod gets its own IP address</li><li>All Pods can communicate with all other Pods without NAT</li><li>Nodes can communicate with Pods without NAT</li></ul><strong>CNI (Container Network Interface)</strong> is a spec for network plugins. Popular CNIs:<ul><li><strong>Calico</strong>: BGP-based, supports NetworkPolicy, high performance</li><li><strong>Flannel</strong>: Simple overlay network (VXLAN)</li><li><strong>Cilium</strong>: eBPF-based, advanced observability and policy</li><li><strong>Weave</strong>: Simple mesh, supports encryption</li></ul>kubelet calls the CNI plugin when a pod is created/deleted to set up/tear down network interfaces.`, cat: 'networking', level: 'intermediate' },
  { q: 'What are the different types of Kubernetes Services?', a: `<ul><li><strong>ClusterIP</strong> (default): Internal virtual IP, only reachable within the cluster. Used for service-to-service communication.</li><li><strong>NodePort</strong>: Exposes service on a static port (30000-32767) on every node's IP. Accessible externally but requires node IP.</li><li><strong>LoadBalancer</strong>: Provisions a cloud load balancer (AWS ELB, GCP LB). Best for production external traffic.</li><li><strong>ExternalName</strong>: Maps a service to an external DNS name (e.g., <code>db.example.com</code>). No proxying.</li><li><strong>Headless</strong>: ClusterIP=None. Returns pod IPs directly via DNS. Used with StatefulSets.</li></ul>`, cat: 'networking', level: 'intermediate' },
  { q: 'What is a NetworkPolicy and how does it work?', a: `NetworkPolicies are firewall rules for pods. By default, all traffic is allowed. Applying a NetworkPolicy restricts traffic.<br/><br/>Example — allow only frontend to access backend:<pre>spec:\n  podSelector:\n    matchLabels:\n      app: backend\n  ingress:\n  - from:\n    - podSelector:\n        matchLabels:\n          app: frontend\n    ports:\n    - port: 8080</pre><strong>Important:</strong> NetworkPolicies require a CNI that supports them (Calico, Cilium). Flannel does not natively support NetworkPolicy enforcement.`, cat: 'networking', level: 'advanced' },
  { q: 'How does kube-proxy work and what are its modes?', a: `<code>kube-proxy</code> runs on every node and implements K8s Service networking by maintaining network rules.<br/><br/><strong>Modes:</strong><ul><li><strong>iptables</strong> (default): Uses iptables rules to intercept and redirect traffic. O(n) rule lookup but well-tested.</li><li><strong>IPVS</strong>: Uses Linux kernel IPVS (IP Virtual Server). O(1) lookup, supports multiple LB algorithms (round robin, least conn). Better performance at scale.</li><li><strong>Userspace</strong> (legacy): kube-proxy itself proxies traffic. Slow, not recommended.</li></ul>When a Service is created, kube-proxy programs rules so traffic to ClusterIP:Port is NATed to one of the backing pod endpoints.`, cat: 'networking', level: 'advanced' },
  // STORAGE
  { q: 'Explain PersistentVolumes, PersistentVolumeClaims, and StorageClasses.', a: `<ul><li><strong>PersistentVolume (PV)</strong>: A piece of storage in the cluster, provisioned by admin or dynamically. Has a lifecycle independent of any pod.</li><li><strong>PersistentVolumeClaim (PVC)</strong>: A request for storage by a user. Specifies size and access mode. K8s binds PVC to a suitable PV.</li><li><strong>StorageClass</strong>: Enables dynamic provisioning. Defines provisioner (e.g., <code>kubernetes.io/aws-ebs</code>) and parameters. When a PVC references a StorageClass, a PV is automatically created.</li></ul><strong>Access Modes:</strong><ul><li>ReadWriteOnce (RWO) — single node</li><li>ReadOnlyMany (ROX) — many nodes, read-only</li><li>ReadWriteMany (RWX) — many nodes, read-write</li></ul>`, cat: 'storage', level: 'intermediate' },
  { q: 'What is the difference between emptyDir, hostPath, and PersistentVolume?', a: `<ul><li><strong>emptyDir</strong>: Created when a Pod starts, deleted when it ends. Shared between containers in the same pod. Used for scratch space, caches.</li><li><strong>hostPath</strong>: Mounts a file/directory from the host node. Risky in production (ties pod to node, security risk). Used for DaemonSets (e.g., log agents accessing host paths).</li><li><strong>PersistentVolume</strong>: Lifecycle independent of pods. Survives pod restarts/migrations. Backed by real storage (EBS, NFS, Ceph). The correct choice for stateful production workloads.</li></ul>`, cat: 'storage', level: 'intermediate' },
  // SECURITY
  { q: 'Explain Kubernetes RBAC — Roles, ClusterRoles, RoleBindings, ClusterRoleBindings.', a: `<strong>RBAC</strong> (Role-Based Access Control) controls who can do what in K8s.<ul><li><strong>Role</strong>: Grants permissions within a specific namespace</li><li><strong>ClusterRole</strong>: Grants permissions cluster-wide (or usable in any namespace)</li><li><strong>RoleBinding</strong>: Binds a Role/ClusterRole to subjects (users, groups, service accounts) within a namespace</li><li><strong>ClusterRoleBinding</strong>: Binds a ClusterRole to subjects cluster-wide</li></ul>Example principle of least privilege:<pre>apiVersion: rbac.authorization.k8s.io/v1\nkind: Role\nrules:\n- apiGroups: [""]\n  resources: ["pods"]\n  verbs: ["get","list","watch"]</pre>`, cat: 'security', level: 'intermediate' },
  { q: 'What is a Pod Security Context and why is it important?', a: `A <strong>securityContext</strong> defines privilege and access control settings for a pod or container:<pre>securityContext:\n  runAsNonRoot: true\n  runAsUser: 1000\n  readOnlyRootFilesystem: true\n  allowPrivilegeEscalation: false\n  capabilities:\n    drop: ["ALL"]</pre><strong>Why it matters:</strong><ul><li>Prevent containers from running as root</li><li>Limit capabilities to reduce attack surface</li><li>Immutable filesystem prevents runtime changes</li><li>Required by Pod Security Admission (PSA) policies in production</li></ul>Always apply the most restrictive security context possible.`, cat: 'security', level: 'advanced' },
  { q: 'What are Secrets in Kubernetes and what are their security limitations?', a: `Secrets store sensitive data (passwords, tokens, keys). They are base64-encoded (NOT encrypted by default) and stored in etcd.<br/><br/><strong>Limitations:</strong><ul><li>Base64 is encoding, not encryption — anyone with etcd access can read them</li><li>Distributed to nodes in plaintext if not using encryption at rest</li></ul><strong>Best practices:</strong><ul><li>Enable <code>EncryptionConfiguration</code> in etcd to encrypt secrets at rest</li><li>Use external secret managers: HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager</li><li>Use RBAC to restrict who can read secrets</li><li>Avoid logging secret values; use <code>envFrom</code> cautiously</li></ul>`, cat: 'security', level: 'advanced' },
  // SCALING
  { q: 'Explain Horizontal vs Vertical Pod Autoscaling.', a: `<ul><li><strong>HPA (Horizontal)</strong>: Adds/removes pod <em>replicas</em> based on metrics. Supported metrics: CPU, memory, custom (Prometheus), external. Best for stateless workloads.<pre>kubectl autoscale deploy myapp --cpu-percent=70 --min=2 --max=20</pre></li><li><strong>VPA (Vertical)</strong>: Adjusts the CPU/memory <em>requests and limits</em> of existing pods. Requires pod restarts (eviction). Best for stateful apps or when you can't scale horizontally.</li><li><strong>KEDA</strong>: Event-driven autoscaler. Scales based on queue depth, Kafka lag, HTTP requests/sec, etc. Can scale to zero.</li></ul>HPA + VPA can conflict; use VPA in "Off" mode to get recommendations only if combining.`, cat: 'scaling', level: 'intermediate' },
  { q: 'What is Cluster Autoscaler and how does it work?', a: `<strong>Cluster Autoscaler (CA)</strong> adjusts the <em>number of nodes</em> in a cluster.<br/><br/><strong>Scale up:</strong> When pods are in <code>Pending</code> state due to insufficient resources, CA adds a node to the node group (ASG/MIG).<br/><br/><strong>Scale down:</strong> When a node utilization is below a threshold (default 50%) and its pods can be rescheduled elsewhere, CA removes the node after a configurable quiet period.<br/><br/><strong>Important considerations:</strong><ul><li>Works with cloud provider node groups (AWS ASG, GCP MIG, Azure VMSS)</li><li>Respects PDBs and <code>safe-to-evict: "false"</code> annotations</li><li>Does not downscale nodes with PVs (can be configured)</li><li>Combine with HPA for complete autoscaling solution</li></ul>`, cat: 'scaling', level: 'advanced' },
  // PRODUCTION
  { q: 'What are best practices for running Kubernetes in production?', a: `<ul><li><strong>Resource requests/limits</strong> on all containers to enable proper scheduling and prevent noisy neighbors</li><li><strong>Liveness + Readiness + Startup probes</strong> for health management</li><li><strong>PodDisruptionBudgets</strong> on all critical workloads</li><li><strong>RBAC + least privilege</strong> — no default service account in production pods</li><li><strong>Network policies</strong> enforcing zero-trust between namespaces</li><li><strong>Image scanning</strong> in CI/CD pipeline (Trivy, Snyk)</li><li><strong>Namespace quotas</strong> to prevent runaway resource consumption</li><li><strong>Pod anti-affinity</strong> to spread replicas across zones/nodes</li><li><strong>Secrets management</strong> via Vault or cloud secret store</li><li><strong>Audit logging</strong> enabled on the API server</li></ul>`, cat: 'production', level: 'advanced' },
  { q: 'How do you implement zero-downtime deployments in Kubernetes?', a: `Zero-downtime requires correct configuration of several subsystems:<ul><li><strong>RollingUpdate strategy</strong> with maxUnavailable: 0</li><li><strong>Readiness probe</strong> — K8s only sends traffic to <em>ready</em> pods. Without this, traffic goes to starting pods causing errors.</li><li><strong>preStop hook + terminationGracePeriodSeconds</strong> — ensures in-flight requests complete before container is stopped:<pre>lifecycle:\n  preStop:\n    exec:\n      command: ["sleep","10"]</pre></li><li><strong>minReadySeconds</strong> — pod must be ready for N seconds before it counts, preventing cascading failures</li><li><strong>PodDisruptionBudget</strong> — maintains minimum replicas during node drains</li></ul>`, cat: 'production', level: 'advanced' },
  { q: 'Explain Blue-Green and Canary deployment strategies in Kubernetes.', a: `<strong>Blue-Green:</strong><ul><li>Maintain two identical environments (blue=current, green=new)</li><li>Deploy new version to green; switch service label selector to point to green</li><li>Instant cutover, easy rollback (switch selector back)</li><li>Doubles resource usage temporarily</li></ul><strong>Canary:</strong><ul><li>Route small % of traffic to new version (e.g., 5% to v2, 95% to v1)</li><li>In K8s: control by replica ratio (1 canary pod + 19 stable pods = 5%)</li><li>Advanced: Use Istio/Argo Rollouts for weight-based traffic splitting</li><li>Monitor error rate; promote or abort</li></ul>Tools: <strong>Argo Rollouts</strong>, <strong>Flagger</strong> (with Prometheus metrics), <strong>Istio</strong>.`, cat: 'production', level: 'advanced' },
  // TROUBLESHOOTING
  { q: 'A pod is stuck in "Pending" state. How do you troubleshoot it?', a: `<strong>Step 1:</strong> <code>kubectl describe pod &lt;pod&gt;</code> — check Events section at the bottom.<br/><br/><strong>Common causes:</strong><ul><li><strong>Insufficient resources</strong>: "0/3 nodes are available: 3 Insufficient cpu" → scale cluster or reduce requests</li><li><strong>Node selector/affinity mismatch</strong>: No node matches the pod's nodeSelector → fix labels or remove constraint</li><li><strong>PVC not bound</strong>: Pod waiting for storage → check <code>kubectl get pvc</code></li><li><strong>Taint/toleration mismatch</strong>: Node is tainted but pod has no toleration → add toleration or untaint node</li><li><strong>Image pull backoff</strong>: Wrong image name or missing imagePullSecret</li></ul><strong>Useful commands:</strong><pre>kubectl describe pod &lt;pod&gt;\nkubectl get events --sort-by=.lastTimestamp\nkubectl top nodes</pre>`, cat: 'troubleshooting', level: 'intermediate' },
  { q: 'A pod is in "CrashLoopBackOff". Walk through your debugging process.', a: `CrashLoopBackOff means the container is starting and crashing repeatedly. K8s uses exponential backoff between restarts.<br/><br/><strong>Debugging steps:</strong><ol><li><code>kubectl logs &lt;pod&gt;</code> — check application logs</li><li><code>kubectl logs &lt;pod&gt; --previous</code> — logs from the last crash</li><li><code>kubectl describe pod &lt;pod&gt;</code> — check exit code in "Last State"</li><li>Exit code meanings: <code>1</code>=app error, <code>137</code>=OOM killed, <code>139</code>=segfault, <code>143</code>=graceful SIGTERM</li></ol><strong>Common causes:</strong><ul><li>Application error/exception on startup</li><li>Missing environment variable or secret</li><li>OOM: container exceeds memory limit → increase limit</li><li>Wrong startup command/entrypoint</li><li>Liveness probe too aggressive (fails before app is ready) → increase initialDelaySeconds</li></ul>`, cat: 'troubleshooting', level: 'intermediate' },
  {
    q: 'How do you drain a node safely for maintenance?', a: `<pre># Mark node unschedulable (no new pods)
kubectl cordon &lt;node-name&gt;

# Evict all pods (respects PDBs)
kubectl drain &lt;node-name&gt; \\
  --ignore-daemonsets \\
  --delete-emptydir-data \\
  --grace-period=120</pre><strong>What drain does:</strong><ul><li>Cordons the node first</li><li>Evicts pods respecting <code>PodDisruptionBudgets</code></li><li>DaemonSet pods are ignored (can't be evicted)</li><li>Pods with local storage (emptyDir) need <code>--delete-emptydir-data</code></li></ul><strong>After maintenance:</strong><pre>kubectl uncordon &lt;node-name&gt;</pre><strong>Note:</strong> If PDB blocks eviction, drain will hang. Check: <code>kubectl get pdb -A</code>`, cat: 'troubleshooting', level: 'intermediate'
  },

  // SCHEDULING & NODE MANAGEMENT
  {
    q: 'What are Taints and Tolerations in Kubernetes?', a: `<strong>Taints</strong> repel pods from nodes; <strong>Tolerations</strong> allow pods to schedule onto tainted nodes.<br/><br/><strong>Adding a taint:</strong><pre>kubectl taint nodes node1 dedicated=gpu:NoSchedule</pre><strong>Effects:</strong><ul><li><code>NoSchedule</code> — new pods won't schedule unless they tolerate the taint</li><li><code>PreferNoSchedule</code> — soft version, scheduler tries to avoid</li><li><code>NoExecute</code> — evicts existing pods that don't tolerate the taint</li></ul><strong>Toleration in pod spec:</strong><pre>tolerations:
- key: "dedicated"
  operator: "Equal"
  value: "gpu"
  effect: "NoSchedule"</pre><strong>Use cases:</strong> dedicated GPU nodes, spot/preemptible nodes, tainted master nodes.`, cat: 'scheduling', level: 'intermediate'
  },

  {
    q: 'Explain Pod Affinity and Anti-Affinity.', a: `Affinity rules give fine-grained control over pod placement beyond simple node selectors.<br/><br/><strong>Node Affinity</strong> — constrain pods to specific nodes:<pre>affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.kubernetes.io/zone
          operator: In
          values: [us-east-1a]</pre><strong>Pod Anti-Affinity</strong> — spread replicas across nodes/zones:<pre>affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 100
      podAffinityTerm:
        labelSelector:
          matchLabels: {app: web}
        topologyKey: kubernetes.io/hostname</pre><ul><li><code>required</code> — hard constraint; pod stays Pending if not met</li><li><code>preferred</code> — soft constraint; scheduler tries but doesn't guarantee</li></ul>`, cat: 'scheduling', level: 'advanced'
  },

  // INGRESS & NETWORKING ADVANCED
  {
    q: 'What is an Ingress and how does it differ from a Service?', a: `A <strong>Service</strong> operates at L4 (TCP/UDP) and provides stable IP/DNS to pods. An <strong>Ingress</strong> operates at L7 (HTTP/HTTPS) and provides:<ul><li><strong>Path-based routing</strong>: <code>/api</code> → backend service, <code>/</code> → frontend service</li><li><strong>Host-based routing</strong>: <code>api.example.com</code> vs <code>app.example.com</code></li><li><strong>TLS termination</strong>: SSL handled at the Ingress, plain HTTP to backends</li></ul>An Ingress requires an <strong>Ingress Controller</strong> (Nginx, Traefik, AWS ALB, Istio Gateway) to actually process the rules.<br/><br/>Example:<pre>rules:
- host: app.example.com
  http:
    paths:
    - path: /api
      pathType: Prefix
      backend:
        service: {name: api-svc, port: {number: 80}}</pre>`, cat: 'networking', level: 'intermediate'
  },

  // HELM & PACKAGE MANAGEMENT
  {
    q: 'What is Helm and what problem does it solve in Kubernetes?', a: `<strong>Helm</strong> is the package manager for Kubernetes. It solves the problem of managing complex multi-resource applications.<br/><br/><strong>Core concepts:</strong><ul><li><strong>Chart</strong>: A collection of templates + default values describing a K8s application</li><li><strong>Release</strong>: A specific deployed instance of a chart</li><li><strong>Repository</strong>: A collection of charts (e.g., Artifact Hub, Bitnami)</li><li><strong>Values</strong>: User-provided configuration that overrides chart defaults</li></ul><strong>Key commands:</strong><pre>helm install myapp ./mychart -f prod-values.yaml
helm upgrade myapp ./mychart --set image.tag=v2
helm rollback myapp 1
helm uninstall myapp
helm list -A</pre><strong>Benefits:</strong> versioned rollbacks, templating, reusable charts, dependency management. Helm 3 removed Tiller (security improvement over Helm 2).`, cat: 'tooling', level: 'intermediate'
  },

  {
    q: 'What is a Helm hook and when would you use one?', a: `Helm <strong>hooks</strong> are chart templates that run at specific points in the release lifecycle, controlled by the annotation <code>helm.sh/hook</code>.<br/><br/><strong>Common hook types:</strong><ul><li><code>pre-install</code> / <code>post-install</code>: Run Jobs before/after the chart is installed</li><li><code>pre-upgrade</code> / <code>post-upgrade</code>: Run before/after upgrades</li><li><code>pre-delete</code> / <code>post-delete</code>: Run before/after uninstall</li><li><code>test</code>: Run when <code>helm test</code> is called</li></ul><strong>Use cases:</strong><ul><li>Database migrations before upgrading the app</li><li>Sending notifications after deployment</li><li>Smoke tests after install</li><li>Cleaning up external resources on delete</li></ul><pre>annotations:
  "helm.sh/hook": pre-upgrade
  "helm.sh/hook-weight": "0"
  "helm.sh/hook-delete-policy": hook-succeeded</pre>`, cat: 'tooling', level: 'advanced'
  },

  // OPERATORS & CRDS
  { q: 'What is the Operator Pattern in Kubernetes?', a: `An <strong>Operator</strong> is a method of packaging, deploying, and managing a Kubernetes application using custom resources and a controller that encodes operational knowledge.<br/><br/><strong>Components:</strong><ul><li><strong>CRD (Custom Resource Definition)</strong>: Defines a new API resource type (e.g., <code>kind: PostgresCluster</code>)</li><li><strong>Custom Controller</strong>: Watches the custom resource and reconciles actual vs desired state</li></ul><strong>Operator capability levels (OperatorHub maturity model):</strong><ol><li>Basic install</li><li>Seamless upgrades</li><li>Full lifecycle (backup, restore)</li><li>Deep insights (metrics, alerts)</li><li>Auto pilot (auto-scaling, self-tuning)</li></ol><strong>Popular Operators:</strong> Prometheus Operator, Cert-Manager, Strimzi (Kafka), CloudNativePG, Argo CD.<br/><br/>Build operators with: <strong>operator-sdk</strong>, <strong>Kubebuilder</strong>, or <strong>KUDO</strong>.`, cat: 'advanced', level: 'advanced' },

  // OBSERVABILITY
  { q: 'How do you implement observability in Kubernetes? Explain the three pillars.', a: `The three pillars of observability in K8s:<br/><br/><strong>1. Metrics</strong><ul><li><strong>Prometheus</strong>: Scrapes metrics from pods (via /metrics endpoint), nodes, and K8s components</li><li><strong>Grafana</strong>: Visualizes Prometheus data with dashboards</li><li>Key metrics: CPU/memory usage, pod restart count, request rate, error rate, latency</li><li>Expose custom metrics with <code>prometheus.io/scrape: "true"</code> annotation</li></ul><strong>2. Logs</strong><ul><li><strong>ELK Stack</strong>: Elasticsearch + Logstash + Kibana</li><li><strong>EFK Stack</strong>: Elasticsearch + Fluentd (DaemonSet) + Kibana — preferred in K8s</li><li><strong>Loki + Grafana</strong>: Lightweight alternative, stores log indexes not full text</li></ul><strong>3. Traces</strong><ul><li><strong>Jaeger / Zipkin</strong>: Distributed tracing across microservices</li><li>OpenTelemetry: Vendor-neutral instrumentation SDK</li><li>Helps identify latency bottlenecks across service calls</li></ul>`, cat: 'observability', level: 'advanced' },

  // GITOPS
  {
    q: 'What is GitOps and how does Argo CD implement it in Kubernetes?', a: `<strong>GitOps</strong> is a deployment paradigm where Git is the single source of truth for desired cluster state. Any change to infrastructure goes through a Git PR.<br/><br/><strong>Core principles:</strong><ul><li>Declarative: entire system described declaratively</li><li>Versioned: state stored in Git with history</li><li>Pulled automatically: agents pull and apply changes</li><li>Continuously reconciled: divergence is detected and corrected</li></ul><strong>Argo CD:</strong><ul><li>Runs as a K8s controller watching Git repos</li><li>Compares live state with desired state in Git</li><li>Supports Helm, Kustomize, raw YAML, Jsonnet</li><li>Provides UI for visualizing sync status and health</li><li>Auto-sync or manual approval workflows</li></ul><pre>argocd app create myapp \\
  --repo https://github.com/org/repo \\
  --path ./k8s \\
  --dest-namespace production \\
  --sync-policy automated</pre><strong>Alternatives:</strong> Flux CD (CNCF project, GitOps Toolkit).`, cat: 'gitops', level: 'advanced'
  },

  // SERVICE MESH
  { q: 'What is a Service Mesh and what does Istio provide?', a: `A <strong>service mesh</strong> is an infrastructure layer managing service-to-service communication, adding observability, security, and traffic control without code changes.<br/><br/><strong>How it works:</strong> A sidecar proxy (Envoy) is injected into every pod. All traffic goes through the proxy, which can enforce policies.<br/><br/><strong>Istio features:</strong><ul><li><strong>Traffic management</strong>: Fine-grained routing, canary, circuit breaking, retries, timeouts</li><li><strong>mTLS</strong>: Automatic mutual TLS between all services — no code changes needed</li><li><strong>Observability</strong>: Metrics, traces, and access logs out of the box</li><li><strong>Authorization policies</strong>: L7 policy enforcement (JWT, RBAC)</li></ul><strong>Key Istio resources:</strong><ul><li><code>VirtualService</code>: Traffic routing rules</li><li><code>DestinationRule</code>: Load balancing + circuit breaking policy</li><li><code>Gateway</code>: Manages ingress/egress traffic</li><li><code>PeerAuthentication</code>: mTLS mode</li></ul><strong>Alternatives:</strong> Linkerd (simpler, lighter), Consul Connect, Cilium Service Mesh.`, cat: 'networking', level: 'advanced' },

  // ADMISSION CONTROLLERS
  { q: 'What are Admission Controllers and how do Mutating vs Validating webhooks work?', a: `<strong>Admission controllers</strong> intercept API server requests after authentication/authorization but before persisting to etcd. They can <em>validate</em>, <em>mutate</em>, or <em>reject</em> requests.<br/><br/><strong>Built-in controllers:</strong> LimitRanger, ResourceQuota, PodSecurity, ServiceAccount, DefaultStorageClass<br/><br/><strong>Webhook types:</strong><ul><li><strong>MutatingAdmissionWebhook</strong>: Can modify (mutate) the resource. Runs first. Example: auto-inject Istio sidecar, add default labels, set image pull policy.</li><li><strong>ValidatingAdmissionWebhook</strong>: Can only allow/reject — no modification. Runs after mutating. Example: enforce naming conventions, require resource limits, block privileged containers.</li></ul><strong>Use cases for custom webhooks:</strong><ul><li>OPA/Gatekeeper policy enforcement</li><li>Kyverno security policies</li><li>Auto-injection of service mesh sidecars</li><li>Enforcing mandatory labels for cost allocation</li></ul>The webhook server must be HTTPS and reachable from the K8s API server.`, cat: 'security', level: 'advanced' },

  // JOBS & CRONJOBS
  {
    q: 'Explain Kubernetes Jobs and CronJobs — when to use each?', a: `<strong>Job</strong>: Runs one or more pods to completion. Guarantees the specified number of pods successfully terminate.<pre>spec:
  completions: 3      # run 3 times total
  parallelism: 2      # but only 2 at a time
  backoffLimit: 4     # retry up to 4 times on failure</pre><ul><li>Use for: database migrations, batch data processing, one-time setup tasks</li><li><code>restartPolicy</code> must be <code>Never</code> or <code>OnFailure</code> (not <code>Always</code>)</li></ul><strong>CronJob</strong>: Creates Jobs on a schedule (cron syntax):<pre>schedule: "0 2 * * *"  # Every day at 2am</pre><ul><li>Use for: nightly reports, periodic backups, cache warming, cleanup tasks</li><li>Key fields: <code>successfulJobsHistoryLimit</code>, <code>failedJobsHistoryLimit</code>, <code>concurrencyPolicy</code> (Allow/Forbid/Replace)</li></ul><strong>Important:</strong> CronJobs use UTC timezone by default. Use <code>timeZone</code> field (K8s 1.27+) for local timezone.`, cat: 'workloads', level: 'intermediate'
  },

  // MULTI-CONTAINER PODS
  { q: 'What are the multi-container pod patterns in Kubernetes?', a: `Multiple containers in a pod share the same network namespace and can share volumes. Common patterns:<br/><br/><strong>1. Sidecar</strong>: Augments the main container<ul><li>Log shipper (Fluentd) reads app logs and ships to Elasticsearch</li><li>Envoy proxy intercepting all traffic for service mesh</li><li>Config reloader watching for ConfigMap changes</li></ul><strong>2. Ambassador</strong>: Proxy to outside world<ul><li>Local proxy that handles service discovery, retry logic</li><li>App connects to localhost; ambassador forwards to actual backend</li></ul><strong>3. Adapter</strong>: Standardizes output from main container<ul><li>Transforms app-specific metrics format into Prometheus format</li><li>Normalizes log format for centralized logging</li></ul><strong>Init Containers</strong> (separate category):<ul><li>Run sequentially before app containers start</li><li>Use for: wait for dependencies, seed volumes, fetch configs</li><li>Each init container must exit 0 before next starts</li></ul><strong>K8s 1.29+</strong>: Native Sidecar containers with <code>initContainers[].restartPolicy: Always</code> — they start before main containers but keep running.`, cat: 'workloads', level: 'intermediate' },

  // QoS
  { q: 'What are Kubernetes QoS classes and how are they determined?', a: `Kubernetes assigns a <strong>Quality of Service (QoS)</strong> class to every pod, which determines eviction priority when a node is under memory pressure.<br/><br/><table><tr><th>QoS Class</th><th>Condition</th><th>Eviction Priority</th></tr><tr><td><strong>Guaranteed</strong></td><td>Every container has requests == limits (both CPU & memory)</td><td>Last to be evicted</td></tr><tr><td><strong>Burstable</strong></td><td>At least one container has a request or limit</td><td>Medium priority</td></tr><tr><td><strong>BestEffort</strong></td><td>No container has any requests or limits</td><td>First to be evicted</td></tr></table><br/><strong>Best practice:</strong> Always set both requests and limits on production containers to achieve Guaranteed or Burstable class. BestEffort pods will be killed first during resource contention.`, cat: 'scheduling', level: 'intermediate' },

  // CONFIGMAP VS SECRET
  { q: 'What is the difference between ConfigMap and Secret and how to safely use them?', a: `<ul><li><strong>ConfigMap</strong>: Stores non-sensitive config data as key-value pairs (plain text in etcd). Use for: feature flags, database hostnames, config files, app settings.</li><li><strong>Secret</strong>: Stores sensitive data, base64-encoded in etcd (NOT encrypted by default). Use for: passwords, API keys, TLS certificates, SSH keys.</li></ul><strong>Consumption methods (both types):</strong><ul><li><strong>Env variables</strong>: <code>envFrom: configMapRef</code> or <code>secretRef</code></li><li><strong>Volume mounts</strong>: Files appear in container at mount path — changes can hot-reload</li><li><strong>Projected volumes</strong>: Combine multiple sources</li></ul><strong>Security hardening for Secrets:</strong><ul><li>Enable <code>EncryptionConfiguration</code> in kube-apiserver for at-rest encryption</li><li>Use <strong>External Secrets Operator</strong> with AWS/GCP/Vault as the source of truth</li><li>Restrict access with RBAC (<code>verbs: [get]</code> not <code>[list]</code> — listing reveals all secrets)</li><li>Use <code>imagePullSecrets</code> for private registries, never hardcode credentials in images</li></ul>`, cat: 'config', level: 'intermediate' },

  // ETCD BACKUP
  {
    q: 'How do you back up and restore etcd in Kubernetes?', a: `etcd stores ALL cluster state — backing it up is critical for disaster recovery.<br/><br/><strong>Backup (snapshot):</strong><pre>ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-$(date +%Y%m%d).db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \\
  --key=/etc/kubernetes/pki/etcd/healthcheck-client.key</pre><strong>Verify backup:</strong><pre>etcdctl snapshot status /backup/etcd-snapshot.db</pre><strong>Restore:</strong><pre>etcdctl snapshot restore /backup/etcd-snapshot.db \\
  --data-dir=/var/lib/etcd-restored</pre>Then update etcd configuration to use the new data directory and restart etcd.<br/><br/><strong>Best practices:</strong><ul><li>Automate via CronJob or external scheduler</li><li>Store backups in S3/GCS with versioning</li><li>Test restores regularly</li><li>Back up before every cluster upgrade</li></ul>`, cat: 'production', level: 'advanced'
  },

  // IMAGE PULL POLICIES
  {
    q: 'Explain Kubernetes image pull policies and registry authentication.', a: `<strong>imagePullPolicy</strong> controls when kubelet pulls a container image:<ul><li><code>Always</code>: Always pull from registry (use for <code>:latest</code> or mutable tags in dev)</li><li><code>IfNotPresent</code>: Pull only if not cached on node (default for versioned tags)</li><li><code>Never</code>: Never pull; fail if not on node (use for pre-loaded air-gapped environments)</li></ul><strong>Default behavior:</strong> If tag is <code>:latest</code> or omitted → <code>Always</code>. Otherwise → <code>IfNotPresent</code>.<br/><br/><strong>Private registry authentication:</strong><pre>kubectl create secret docker-registry my-registry-secret \\
  --docker-server=registry.example.com \\
  --docker-username=myuser \\
  --docker-password=mypassword</pre>Then reference in pod spec:<pre>spec:
  imagePullSecrets:
  - name: my-registry-secret</pre><strong>Best practices:</strong><ul><li>Always use specific image digests in production (not tags) — <code>nginx@sha256:abc123</code></li><li>Use a private registry with image scanning (ECR, GCR, Harbor)</li><li>Implement image pull-through / mirroring for reliability</li></ul>`, cat: 'workloads', level: 'beginner'
  },

  // READINESS VS LIVENESS
  { q: 'What is the difference between Liveness, Readiness, and Startup probes?', a: `All three probes support HTTP GET, TCP socket, exec command, and gRPC checks.<br/><br/><table><tr><th>Probe</th><th>Purpose</th><th>Failure action</th></tr><tr><td><strong>Liveness</strong></td><td>Is container alive / not deadlocked?</td><td>kubelet <strong>restarts</strong> the container</td></tr><tr><td><strong>Readiness</strong></td><td>Is container ready to serve traffic?</td><td>Removed from Service <strong>endpoints</strong> (no traffic)</td></tr><tr><td><strong>Startup</strong></td><td>Has the container finished starting?</td><td>kubelet restarts; disables liveness/readiness during startup</td></tr></table><br/><strong>Startup probe</strong> is essential for slow-starting apps (legacy Java apps, large ML models). It gives extra time without aggressive liveness restarts.<br/><br/><strong>Common mistakes:</strong><ul><li>Liveness probe checks external dependencies (DB) → cascading restarts</li><li>Readiness probe not configured → traffic to starting pods → 502s during deploys</li><li>initialDelaySeconds too low → false positives on startup</li></ul>Configure liveness to check app health only; readiness can check dependencies.`, cat: 'workloads', level: 'intermediate' },

  // K8S UPGRADES
  {
    q: 'How do you upgrade a Kubernetes cluster safely?', a: `<strong>Upgrade order matters:</strong> Control plane first, then worker nodes.<br/><br/><strong>1. Pre-upgrade checks:</strong><ul><li>Review release notes and breaking changes (especially API deprecations)</li><li>Check API compatibility: <code>kubectl deprecations</code> (via Pluto tool)</li><li>Back up etcd</li><li>Test upgrade in non-production first</li></ul><strong>2. Upgrade control plane (kubeadm):</strong><pre>apt-mark unhold kubeadm && apt-get install kubeadm=1.29.0-00
kubeadm upgrade plan
kubeadm upgrade apply v1.29.0
apt-get install kubelet=1.29.0-00 kubectl=1.29.0-00
systemctl restart kubelet</pre><strong>3. Upgrade worker nodes (one at a time):</strong><pre>kubectl cordon &lt;node&gt;
kubectl drain &lt;node&gt; --ignore-daemonsets --delete-emptydir-data
# SSH to node -> upgrade kubelet -> restart
kubectl uncordon &lt;node&gt;</pre><strong>Rules:</strong> skew policy allows workers to be 2 minor versions behind control plane. Never skip minor versions (1.27 → 1.28 → 1.29, not 1.27 → 1.29).`, cat: 'production', level: 'advanced'
  },

  // NAMESPACE STRATEGIES
  { q: 'What are best practices for Namespace design in Kubernetes?', a: `Namespaces provide logical isolation but NOT security boundaries by themselves.<br/><br/><strong>Common namespace strategies:</strong><ul><li><strong>Per-environment</strong>: <code>dev</code>, <code>staging</code>, <code>production</code> — simple but risks are in the same cluster</li><li><strong>Per-team</strong>: <code>team-platform</code>, <code>team-payments</code>, <code>team-data</code> — better for multi-tenant clusters</li><li><strong>Per-app</strong>: <code>app-frontend</code>, <code>app-backend</code> — fine-grained but lots of namespaces</li></ul><strong>Per-namespace controls to apply:</strong><ul><li><code>ResourceQuota</code>: CPU/memory/object limits per namespace</li><li><code>LimitRange</code>: Default requests/limits for containers</li><li><code>NetworkPolicy</code>: Deny-all + explicit allows between namespaces</li><li><code>RBAC</code>: RoleBindings scoped to namespace</li><li><code>PodSecurity</code> admission: baseline/restricted profile per namespace</li></ul><strong>Never put:</strong> Untrusted workloads in <code>kube-system</code>. Production and dev workloads in the same namespace.`, cat: 'fundamentals', level: 'intermediate' },

  // PORT-FORWARD VS EXEC
  {
    q: 'When would you use kubectl port-forward vs kubectl exec?', a: `Both are debugging tools but serve different purposes:<br/><br/><strong>kubectl port-forward</strong>: Creates a tunnel from your local machine to a pod/service port.<pre># Forward local 8080 to pod port 80
kubectl port-forward pod/my-pod 8080:80
# Forward to a service
kubectl port-forward svc/my-service 8080:80</pre><ul><li>Use when: Testing HTTP endpoints, connecting to databases, inspecting APIs</li><li>Traffic goes: <code>localhost:8080</code> → API server → pod:80</li><li>Non-invasive, doesn't modify anything</li></ul><strong>kubectl exec</strong>: Opens a shell or runs a command inside a running container.<pre>kubectl exec -it my-pod -- /bin/bash
kubectl exec my-pod -- cat /etc/config/app.yaml</pre><ul><li>Use when: Inspecting files, checking environment variables, running diagnostic commands</li><li>Requires shell (<code>/bin/bash</code> or <code>/bin/sh</code>) to be present in image</li><li>Use <code>kubectl debug</code> for distroless images (no shell)</li></ul>`, cat: 'troubleshooting', level: 'beginner'
  },

  // VERTICAL POD AUTOSCALER
  { q: 'How does Vertical Pod Autoscaler (VPA) work and when should you use it?', a: `<strong>VPA</strong> automatically adjusts the CPU and memory <em>requests and limits</em> of pods based on actual usage.<br/><br/><strong>VPA modes:</strong><ul><li><code>Auto</code>: Evicts and recreates pods with new resources (requires restart)</li><li><code>Recreate</code>: Same as Auto but explicit</li><li><code>Initial</code>: Only sets resources at pod creation; no updates after</li><li><code>Off</code>: Only provides recommendations — no changes made (safe for analysis)</li></ul><strong>When to use VPA:</strong><ul><li>Stateful workloads that can't scale horizontally (databases, ML models)</li><li>Apps with variable load patterns needing right-sized resources</li><li>Starting point for unknown resource requirements (use Off mode first)</li></ul><strong>VPA vs HPA:</strong><ul><li>Don't use both Auto VPA and HPA on CPU (they conflict)</li><li>Safe combo: VPA (Off mode for memory) + HPA (on CPU or custom metric)</li><li>KEDA can replace HPA for event-driven scaling with zero scale</li></ul>`, cat: 'scaling', level: 'advanced' },
];

// ---- ARCHITECTURE COMPONENT INFO ----
const ARCH_INFO = {
  apiserver: { icon: '🔌', name: 'API Server', desc: 'The front-end of the control plane. All communication (kubectl, controllers, kubelet) goes through it. Validates and persists state to etcd. Implements the Kubernetes API as a RESTful service.', tags: ['REST API', 'Auth/AuthZ', 'Rate Limiting', 'Watch'] },
  etcd: { icon: '💾', name: 'etcd', desc: 'Distributed, highly-available key-value store. The single source of truth for all cluster state. Uses Raft consensus algorithm. Only the API server communicates with etcd directly.', tags: ['Raft Consensus', 'Key-Value', 'Backup Critical', 'Port 2379/2380'] },
  scheduler: { icon: '📅', name: 'kube-scheduler', desc: 'Watches for unscheduled Pods and assigns them to nodes. Considers: resource requests/limits, node affinity, taints/tolerations, pod affinity, priority classes, and spread constraints.', tags: ['Bin Packing', 'Affinity', 'Taints', 'Priority'] },
  controller: { icon: '🔄', name: 'Controller Manager', desc: 'Runs all core controllers in a single binary: Deployment, ReplicaSet, StatefulSet, DaemonSet, Node, Job, ServiceAccount, Endpoints controllers. Implements the reconciliation loop.', tags: ['Reconciliation', 'Self-Healing', 'Watch Loops', '40+ Controllers'] },
  ccm: { icon: '☁️', name: 'Cloud Controller', desc: 'Integrates K8s with cloud provider APIs. Manages cloud-specific resources: LoadBalancer provisioning, node lifecycle (cloud metadata), Route management, and storage provisioning.', tags: ['AWS/GCP/Azure', 'LB Provisioning', 'Cloud Routes', 'Node Lifecycle'] },
  kubelet: { icon: '🤖', name: 'kubelet', desc: 'The primary node agent. Reads PodSpecs from API server and ensures containers in a Pod are running and healthy. Reports node status back to control plane. Calls CRI (container runtime) to manage containers.', tags: ['CRI Interface', 'Pod Lifecycle', 'Health Probes', 'Resource Reporting'] },
  kproxy: { icon: '🔀', name: 'kube-proxy', desc: 'Network proxy running on each node. Maintains iptables/IPVS rules to implement Services (ClusterIP, NodePort, LoadBalancer). Routes traffic to the correct backend pod endpoints.', tags: ['iptables', 'IPVS', 'Service VIPs', 'Port Forwarding'] },
  pod: { icon: '📦', name: 'Pod', desc: 'The atomic deployable unit. Contains one or more containers sharing network namespace (IP) and storage (volumes). Containers in a pod communicate via localhost. Pods are ephemeral.', tags: ['Shared Network', 'Shared Storage', 'Sidecar Pattern', 'Ephemeral'] },
  service: { icon: '🔗', name: 'Service', desc: 'Stable virtual IP and DNS name for a set of Pods. Uses label selectors to find backing pods. Types: ClusterIP, NodePort, LoadBalancer, ExternalName. Provides load balancing and service discovery.', tags: ['ClusterIP', 'Load Balancing', 'DNS', 'kube-dns'] },
  ingress: { icon: '🌐', name: 'Ingress', desc: 'Manages external HTTP/HTTPS access to services. Provides URL-based routing, SSL/TLS termination, and virtual hosting. Requires an Ingress Controller (Nginx, Traefik, HAProxy, AWS ALB).', tags: ['SSL Termination', 'Path Routing', 'Host Routing', 'Ingress Controller'] },
  pvc: { icon: '💿', name: 'PV / PVC', desc: 'PersistentVolume (PV) is a piece of storage provisioned by admin or dynamically. PersistentVolumeClaim (PVC) is a request from a pod for storage. StorageClass enables dynamic provisioning.', tags: ['RWO / RWX', 'Dynamic Provision', 'StorageClass', 'Data Persistence'] },
  configmap: { icon: '⚙️', name: 'ConfigMap', desc: 'Stores non-sensitive configuration data as key-value pairs. Can be consumed as environment variables, command-line arguments, or mounted as config files in volumes. Changes hot-reload with eventual consistency.', tags: ['Config Injection', 'Volume Mount', 'Env Vars', 'No Encryption'] },
  secret: { icon: '🔐', name: 'Secret', desc: 'Stores sensitive data (passwords, tokens, TLS certs). Base64-encoded (not encrypted by default). Should be combined with etcd encryption-at-rest and external vaults for production use.', tags: ['Base64', 'RBAC Critical', 'TLS Certs', 'Vault Integration'] },
};

// ---- LEARN TOPICS ----
const LEARN_TOPICS = [
  // ===================== FUNDAMENTALS =====================
  {
    id: 'what-is-k8s', category: 'fundamentals', title: 'What is Kubernetes?', icon: '☸️', level: 'beginner',
    content: `
      <div class="learn-intro">Kubernetes (K8s) is an open-source container orchestration platform originally built by Google and now maintained by the CNCF. It automates deployment, scaling, and management of containerized applications across a cluster of machines.</div>
      <div class="learn-callout learn-callout-tip">💡 K8s is an abbreviation for Kubernetes — there are 8 letters between the K and the s.</div>
      <div class="learn-section">
        <h3>🔥 The Problem Kubernetes Solves</h3>
        <p>Modern applications are made up of dozens of tiny, independent services (microservices) running in containers. Managing hundreds of containers manually — making sure they start, restart on failure, scale up under load, and communicate — is nearly impossible. Kubernetes automates all of this.</p>
      </div>
      <div class="learn-section">
        <h3>✨ Core Capabilities</h3>
        <ul>
          <li><strong>Self-healing</strong> — Automatically restarts failed containers, replaces and reschedules containers when nodes die</li>
          <li><strong>Auto-scaling</strong> — Scales applications up and down based on demand automatically</li>
          <li><strong>Rolling updates</strong> — Deploy new versions with zero downtime; rollback if something goes wrong</li>
          <li><strong>Service discovery</strong> — Containers find each other automatically via DNS and load balancing</li>
          <li><strong>Secret management</strong> — Manage sensitive config without exposing it in your code</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>🐳 Kubernetes vs Docker</h3>
        <p>Docker packages and runs individual containers. Kubernetes <em>orchestrates</em> many containers across many machines. Think of Docker as a single container engine and Kubernetes as the conductor of an orchestra of containers.</p>
      </div>`,
    quiz: [
      { q: 'What does the "8" in K8s stand for?', opts: ['8 versions of Kubernetes', '8 letters between K and s in Kubernetes', '8 core components', '8 founding engineers'], ans: 1, exp: 'K8s is a numeronym — there are exactly 8 letters between the K and the s in "Kubernetes".' },
      { q: 'Which organization currently maintains Kubernetes?', opts: ['Google', 'Microsoft', 'CNCF (Cloud Native Computing Foundation)', 'Docker Inc.'], ans: 2, exp: 'Google originally created Kubernetes but donated it to the CNCF in 2016, which now governs the project.' },
    ]
  },
  {
    id: 'architecture', category: 'fundamentals', title: 'Architecture', icon: '🏗️', level: 'beginner',
    content: `
      <div class="learn-intro">Kubernetes has a master-worker architecture split into the <strong>Control Plane</strong> (the brain) and <strong>Worker Nodes</strong> (the muscle).</div>
      <div class="learn-section">
        <h3>🧠 Control Plane Components</h3>
        <ul>
          <li><strong>kube-apiserver</strong> — The front-end. All communication goes through it. REST API.</li>
          <li><strong>etcd</strong> — Distributed key-value store. Single source of truth for all cluster state.</li>
          <li><strong>kube-scheduler</strong> — Watches for new pods and assigns them to suitable nodes.</li>
          <li><strong>kube-controller-manager</strong> — Runs controllers (Deployment, ReplicaSet, Node, etc.)</li>
          <li><strong>cloud-controller-manager</strong> — Integrates with cloud provider APIs (AWS, GCP, Azure).</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>⚙️ Worker Node Components</h3>
        <ul>
          <li><strong>kubelet</strong> — Agent on every node, ensures containers in a pod are running and healthy.</li>
          <li><strong>kube-proxy</strong> — Manages iptables/IPVS rules for service networking.</li>
          <li><strong>Container Runtime</strong> — Runs containers (containerd, CRI-O). Docker is no longer the default.</li>
        </ul>
      </div>
      <div class="learn-callout learn-callout-note">📝 Only the kube-apiserver communicates with etcd. All other components talk to the API server, never etcd directly.</div>
      <div class="learn-section">
        <h3>🔄 The Reconciliation Loop</h3>
        <p>Every controller runs a loop: watch desired state → compare with actual state → take action to reconcile. This is why Kubernetes is <em>self-healing</em> — it continuously drives toward the desired state.</p>
        <pre><code>Desired: 3 replicas
Actual:  2 replicas
Action:  Create 1 new pod ✓</code></pre>
      </div>`,
    quiz: [
      { q: 'Which component stores all Kubernetes cluster state?', opts: ['kube-apiserver', 'kube-scheduler', 'etcd', 'kubelet'], ans: 2, exp: 'etcd is a distributed key-value store that acts as the single source of truth for the entire cluster state.' },
      { q: 'What does the kube-scheduler do?', opts: ['Runs containers on nodes', 'Assigns unscheduled pods to suitable nodes', 'Manages iptables rules', 'Stores cluster configuration'], ans: 1, exp: 'The scheduler watches for newly created Pods with no assigned node and selects the best node based on resource requirements and constraints.' },
      { q: 'Which component runs on EVERY worker node?', opts: ['etcd', 'kube-apiserver', 'kubelet', 'kube-controller-manager'], ans: 2, exp: 'kubelet is an agent that runs on each node. It ensures that containers described in PodSpecs are running and healthy.' },
    ]
  },
  {
    id: 'kubectl-basics', category: 'fundamentals', title: 'kubectl Basics', icon: '⌨️', level: 'beginner',
    content: `
      <div class="learn-intro"><code>kubectl</code> is the command-line tool for interacting with a Kubernetes cluster. It communicates with the kube-apiserver to create, read, update, and delete Kubernetes resources.</div>
      <div class="learn-section">
        <h3>📋 Essential Commands</h3>
        <pre><code># Get information
kubectl get pods
kubectl get nodes
kubectl get services
kubectl get all -n &lt;namespace&gt;

# Inspect resources
kubectl describe pod &lt;pod-name&gt;
kubectl logs &lt;pod-name&gt;
kubectl logs -f &lt;pod-name&gt;    # follow/tail logs

# Apply configurations
kubectl apply -f manifest.yaml
kubectl delete -f manifest.yaml

# Debug
kubectl exec -it &lt;pod&gt; -- /bin/bash
kubectl port-forward svc/myapp 8080:80</code></pre>
      </div>
      <div class="learn-section">
        <h3>🎯 Output Formats</h3>
        <pre><code>kubectl get pods -o wide        # more columns
kubectl get pod &lt;name&gt; -o yaml  # full YAML
kubectl get pod &lt;name&gt; -o json  # full JSON
kubectl get pods -o jsonpath="{.items[*].metadata.name}"</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Use <code>kubectl explain pod.spec.containers</code> to get inline docs for any field in a manifest — great for writing YAML without memorizing everything.</div>
      <div class="learn-section">
        <h3>🗂️ Kubeconfig & Contexts</h3>
        <pre><code>kubectl config get-contexts         # list all contexts
kubectl config use-context &lt;name&gt;  # switch cluster
kubectl config set-context --current --namespace=dev  # set default ns</code></pre>
      </div>`,
    quiz: [
      { q: 'Which command follows (tails) pod logs in real time?', opts: ['kubectl logs --tail pod', 'kubectl logs -f &lt;pod&gt;', 'kubectl watch logs &lt;pod&gt;', 'kubectl stream &lt;pod&gt;'], ans: 1, exp: 'The -f flag (follow) streams logs continuously from the pod, similar to "tail -f" on a log file.' },
      { q: 'What does "kubectl apply -f manifest.yaml" do?', opts: ['Only creates new resources', 'Deletes and recreates resources', 'Creates or updates resources to match desired state', 'Validates the YAML without applying'], ans: 2, exp: 'kubectl apply is declarative — it creates the resource if it does not exist, or updates it to match the file if it does.' },
    ]
  },
  {
    id: 'pods', category: 'fundamentals', title: 'Pods & Containers', icon: '📦', level: 'beginner',
    content: `
      <div class="learn-intro">A <strong>Pod</strong> is the smallest deployable unit in Kubernetes. It wraps one or more containers that share the same network namespace (IP address) and storage volumes.</div>
      <div class="learn-section">
        <h3>🗂️ Pod Anatomy</h3>
        <pre><code>apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"</code></pre>
      </div>
      <div class="learn-section">
        <h3>🔑 Key Pod Properties</h3>
        <ul>
          <li><strong>Ephemeral</strong> — Pods can be killed and rescheduled at any time. Never store state in a pod's local filesystem.</li>
          <li><strong>Shared network</strong> — All containers in a pod share the same IP and can communicate via <code>localhost</code>.</li>
          <li><strong>Shared volumes</strong> — Containers in a pod can mount the same volumes to share data.</li>
          <li><strong>Single node</strong> — All containers in a pod run on the same node.</li>
        </ul>
      </div>
      <div class="learn-callout learn-callout-warning">⚠️ You rarely create pods directly in production. Use a Deployment or StatefulSet to manage pod lifecycle instead.</div>
      <div class="learn-section">
        <h3>♻️ Pod Lifecycle</h3>
        <ul>
          <li><strong>Pending</strong> — Pod accepted but not yet scheduled to a node</li>
          <li><strong>Running</strong> — Pod bound to node, containers started</li>
          <li><strong>Succeeded</strong> — All containers exited with code 0</li>
          <li><strong>Failed</strong> — At least one container exited non-zero</li>
          <li><strong>Unknown</strong> — Pod state can't be determined (node issue)</li>
        </ul>
      </div>`,
    quiz: [
      { q: 'What do containers in the same pod share?', opts: ['The same CPU cores only', 'Nothing — they are fully isolated', 'Same network namespace (IP) and can share volumes', 'Same process namespace only'], ans: 2, exp: 'Containers in a pod share the same network namespace (IP address and port space) and can share volumes. They communicate via localhost.' },
      { q: 'What does a "Pending" pod status mean?', opts: ['The pod is crashing', 'The pod is accepted but not yet placed on a node', 'The pod is waiting for a user action', 'The pod is being deleted'], ans: 1, exp: 'Pending means the pod was accepted by K8s but has not been scheduled to a node yet — usually due to insufficient resources or scheduling constraints.' },
    ]
  },

  // ===================== WORKLOADS =====================
  {
    id: 'deployments', category: 'workloads', title: 'Deployments', icon: '🚀', level: 'beginner',
    content: `
      <div class="learn-intro">A <strong>Deployment</strong> manages a ReplicaSet, which maintains a stable set of identical Pods. Deployments are the standard way to run stateless applications in Kubernetes.</div>
      <div class="learn-section">
        <h3>📄 Deployment Manifest</h3>
        <pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web
        image: nginx:1.25
        ports:
        - containerPort: 80
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # extra pods during update
      maxUnavailable: 0  # zero-downtime</code></pre>
      </div>
      <div class="learn-section">
        <h3>🔄 Rolling Updates & Rollbacks</h3>
        <pre><code># Update image
kubectl set image deployment/web-app web=nginx:1.26

# Watch rollout
kubectl rollout status deployment/web-app

# View history
kubectl rollout history deployment/web-app

# Rollback to previous version
kubectl rollout undo deployment/web-app</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Deployments maintain a revision history (controlled by <code>revisionHistoryLimit</code>, default 10). You can roll back to any revision with <code>--to-revision=N</code>.</div>
      <div class="learn-section">
        <h3>📊 Scaling</h3>
        <pre><code>kubectl scale deployment/web-app --replicas=10
kubectl autoscale deployment/web-app --min=2 --max=20 --cpu-percent=70</code></pre>
      </div>`,
    quiz: [
      { q: 'What Kubernetes object does a Deployment manage?', opts: ['Pods directly', 'ReplicaSet', 'StatefulSet', 'DaemonSet'], ans: 1, exp: 'A Deployment manages ReplicaSets, which in turn manage individual Pods. The Deployment adds rolling update and rollback capabilities on top.' },
      { q: 'What does "maxUnavailable: 0" in a RollingUpdate strategy mean?', opts: ['The deployment is paused', 'No pods can be unavailable — ensures zero-downtime updates', 'Updates are disabled', 'Old pods are deleted before new ones start'], ans: 1, exp: 'maxUnavailable: 0 ensures that during a rolling update, the total number of available pods never drops below the desired count — achieving zero-downtime deployments.' },
    ]
  },
  {
    id: 'services', category: 'workloads', title: 'Services', icon: '🔗', level: 'beginner',
    content: `
      <div class="learn-intro">A <strong>Service</strong> provides a stable virtual IP (ClusterIP) and DNS name for a group of pods. Since pod IPs change when pods restart, services give clients a permanent address to connect to.</div>
      <div class="learn-section">
        <h3>🏷️ Service Types</h3>
        <ul>
          <li><strong>ClusterIP</strong> (default) — Internal IP only. Service-to-service communication inside the cluster.</li>
          <li><strong>NodePort</strong> — Exposes on a static port (30000–32767) on every node's IP. Accessible externally.</li>
          <li><strong>LoadBalancer</strong> — Provisions a cloud load balancer (AWS ELB, GCP LB). Best for production external traffic.</li>
          <li><strong>ExternalName</strong> — Maps a service to an external DNS name. No proxying.</li>
          <li><strong>Headless</strong> — ClusterIP: None. Returns pod IPs directly via DNS. Used with StatefulSets.</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 Service Manifest</h3>
        <pre><code>apiVersion: v1
kind: Service
metadata:
  name: web-svc
spec:
  selector:
    app: web-app     # matches pod labels
  ports:
  - port: 80         # service port
    targetPort: 8080 # pod port
  type: ClusterIP</code></pre>
      </div>
      <div class="learn-callout learn-callout-note">📝 Services use <strong>label selectors</strong> to find their backing pods. Any pod with matching labels becomes an endpoint. This decouples services from specific pod instances.</div>`,
    quiz: [
      { q: 'Which Service type is only reachable within the cluster?', opts: ['NodePort', 'LoadBalancer', 'ClusterIP', 'ExternalName'], ans: 2, exp: 'ClusterIP creates an internal virtual IP accessible only within the cluster. It is the default service type used for internal service-to-service communication.' },
      { q: 'What does a Service use to find its backing pods?', opts: ['Pod names', 'Pod IPs directly', 'Label selectors', 'Node names'], ans: 2, exp: 'Services use label selectors to dynamically find pods. Any pod with matching labels becomes an endpoint — this is what makes services resilient to pod restarts.' },
    ]
  },
  {
    id: 'labels-selectors', category: 'workloads', title: 'Labels & Selectors', icon: '🏷️', level: 'beginner',
    content: `
      <div class="learn-intro"><strong>Labels</strong> are key-value pairs attached to Kubernetes objects. <strong>Selectors</strong> are queries that filter objects by their labels. Together they form the primary grouping mechanism in Kubernetes.</div>
      <div class="learn-section">
        <h3>🔖 Labels vs Annotations</h3>
        <ul>
          <li><strong>Labels</strong> — Used for selection and grouping. Keep them short. Used by Services, Deployments, NetworkPolicies to find pods.</li>
          <li><strong>Annotations</strong> — Store arbitrary metadata not used for selection. Example: deployment timestamps, tool metadata, contact info.</li>
        </ul>
        <pre><code>metadata:
  labels:
    app: web          # used for selection
    version: "2.1"
    env: production
  annotations:
    deployed-by: "github-actions"  # metadata only
    docs: "https://wiki.example.com"</code></pre>
      </div>
      <div class="learn-section">
        <h3>🔍 Selector Types</h3>
        <pre><code># Equality-based
kubectl get pods -l env=production
kubectl get pods -l env!=staging

# Set-based
kubectl get pods -l 'env in (production, staging)'
kubectl get pods -l 'version notin (1.0, 1.1)'
kubectl get pods -l '!deprecated'

# Multiple labels (AND)
kubectl get pods -l app=web,env=production</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Good label conventions: use <code>app</code>, <code>version</code>, <code>env</code>, <code>component</code>, <code>managed-by</code>. Kubernetes itself recommends these in its <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/" target="_blank">common labels guide</a>.</div>`,
    quiz: [
      { q: 'What is the difference between labels and annotations?', opts: ['No difference', 'Labels are for selection; annotations are for arbitrary metadata not used for querying', 'Annotations are used for selection; labels are metadata', 'Labels are encrypted; annotations are not'], ans: 1, exp: 'Labels are used by selectors to group and find objects. Annotations store metadata but cannot be used in selectors — they are for informational or tool-based use.' },
    ]
  },
  {
    id: 'statefulsets', category: 'workloads', title: 'StatefulSets', icon: '🗄️', level: 'intermediate',
    content: `
      <div class="learn-intro">A <strong>StatefulSet</strong> manages stateful applications where each pod needs a stable identity, stable network hostname, and stable persistent storage. Unlike Deployments, pods in a StatefulSet are NOT interchangeable.</div>
      <div class="learn-section">
        <h3>🆔 What Makes StatefulSets Special</h3>
        <ul>
          <li><strong>Stable pod names</strong>: <code>mydb-0</code>, <code>mydb-1</code>, <code>mydb-2</code> — not random hashes</li>
          <li><strong>Stable DNS</strong>: <code>mydb-0.mydb-svc.default.svc.cluster.local</code></li>
          <li><strong>Ordered deployment</strong>: Pods start in order (0, 1, 2) and stop in reverse (2, 1, 0)</li>
          <li><strong>Per-pod PVCs</strong>: Each pod gets its own PersistentVolumeClaim, not shared storage</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 StatefulSet Manifest</h3>
        <pre><code>apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mydb
spec:
  serviceName: "mydb-svc"  # headless service required
  replicas: 3
  selector:
    matchLabels:
      app: mydb
  template:
    spec:
      containers:
      - name: db
        image: postgres:15
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:    # creates PVC per pod
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi</code></pre>
      </div>
      <div class="learn-callout learn-callout-note">📝 StatefulSets require a <strong>headless service</strong> (<code>clusterIP: None</code>) to give each pod a stable DNS entry.</div>
      <div class="learn-section">
        <h3>✅ When to Use</h3>
        <p>Use StatefulSets for: databases (PostgreSQL, MySQL, MongoDB, Cassandra), message queues (Kafka, RabbitMQ), distributed caches (Redis Cluster), and any application where pods cannot be treated as anonymous replicas.</p>
      </div>`,
    quiz: [
      { q: 'What naming pattern do StatefulSet pods follow?', opts: ['Random hash like Deployments', 'Sequential ordinal: mydb-0, mydb-1, mydb-2', 'UUID-based names', 'Node-name based names'], ans: 1, exp: 'StatefulSet pods get stable, predictable names with a sequential ordinal index (pod-0, pod-1, etc.) that persists across rescheduling.' },
      { q: 'What type of service is required by a StatefulSet?', opts: ['LoadBalancer type', 'NodePort type', 'Headless service (clusterIP: None)', 'ExternalName service'], ans: 2, exp: 'StatefulSets require a headless service (clusterIP: None) which creates individual DNS entries for each pod: pod-0.svc.namespace.svc.cluster.local' },
    ]
  },
  {
    id: 'daemonsets', category: 'workloads', title: 'DaemonSets', icon: '👾', level: 'intermediate',
    content: `
      <div class="learn-intro">A <strong>DaemonSet</strong> ensures that exactly one copy of a pod runs on every node (or a subset of nodes). When new nodes join the cluster, DaemonSet pods are automatically added to them.</div>
      <div class="learn-section">
        <h3>🎯 Classic Use Cases</h3>
        <ul>
          <li><strong>Log collection</strong>: Fluentd, Logstash — collects logs from each node's filesystem</li>
          <li><strong>Monitoring agents</strong>: Datadog agent, Prometheus node-exporter — system metrics per node</li>
          <li><strong>Network plugins</strong>: Calico, Cilium — CNI plugins that must run on every node</li>
          <li><strong>Storage plugins</strong>: CSI drivers, Ceph daemons</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 DaemonSet Manifest</h3>
        <pre><code>apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
  namespace: kube-system
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        effect: NoSchedule    # run on master too
      containers:
      - name: fluentd
        image: fluent/fluentd:v1.16
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 DaemonSets are automatically excluded from <code>kubectl drain</code> — you must pass <code>--ignore-daemonsets</code> when draining a node.</div>`,
    quiz: [
      { q: 'What does a DaemonSet guarantee?', opts: ['Exactly 3 replicas cluster-wide', 'One pod per namespace', 'One pod on every (or selected) node', 'Pods run only on master nodes'], ans: 2, exp: 'DaemonSets ensure exactly one pod runs on every eligible node. When nodes are added to the cluster, DaemonSet pods are automatically scheduled on them.' },
    ]
  },
  {
    id: 'jobs-cronjobs', category: 'workloads', title: 'Jobs & CronJobs', icon: '⏱️', level: 'intermediate',
    content: `
      <div class="learn-intro">A <strong>Job</strong> creates pods that run to completion. A <strong>CronJob</strong> creates Jobs on a time-based schedule. Use them for batch processing, data migrations, and periodic tasks.</div>
      <div class="learn-section">
        <h3>📄 Job Manifest</h3>
        <pre><code>apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  completions: 1     # run to success once
  backoffLimit: 4    # retry up to 4 times
  template:
    spec:
      restartPolicy: OnFailure  # Never or OnFailure
      containers:
      - name: migrator
        image: myapp:v2
        command: ["python", "migrate.py"]</code></pre>
      </div>
      <div class="learn-section">
        <h3>⏰ CronJob Manifest</h3>
        <pre><code>apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
spec:
  schedule: "0 2 * * *"    # 2am UTC every day
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - name: backup
            image: backup-tool:latest
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  concurrencyPolicy: Forbid  # Allow / Forbid / Replace</code></pre>
      </div>
      <div class="learn-callout learn-callout-warning">⚠️ Jobs require <code>restartPolicy: Never</code> or <code>OnFailure</code>. <code>Always</code> is not allowed because the pod must be able to complete.</div>`,
    quiz: [
      { q: 'What restartPolicy values are allowed in a Job?', opts: ['Always only', 'Never and OnFailure', 'OnFailure and Always', 'Any restart policy'], ans: 1, exp: 'Jobs require restartPolicy: Never or OnFailure. The Always policy is forbidden because a Job needs pods to complete and terminate.' },
      { q: 'What does CronJob concurrencyPolicy: Forbid do?', opts: ['Prevents the CronJob from running at all', 'Skips a new job run if the previous one is still running', 'Replaces running job with the new one', 'Runs all jobs in parallel'], ans: 1, exp: 'Forbid skips the new job execution if the previous job is still running. This prevents concurrent runs of the same job which could cause data conflicts.' },
    ]
  },

  // ===================== NETWORKING =====================
  {
    id: 'ingress', category: 'networking', title: 'Ingress', icon: '🌐', level: 'intermediate',
    content: `
      <div class="learn-intro">An <strong>Ingress</strong> is a Kubernetes resource that manages external HTTP/HTTPS access to services in a cluster. It provides load balancing, SSL termination, and name-based virtual hosting at Layer 7.</div>
      <div class="learn-section">
        <h3>↔️ Ingress vs Service</h3>
        <ul>
          <li><strong>Service (L4)</strong>: Works at TCP/UDP level. No awareness of HTTP paths or hostnames.</li>
          <li><strong>Ingress (L7)</strong>: HTTP-aware. Routes based on URL paths and hostnames. Can terminate TLS.</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 Ingress Manifest</h3>
        <pre><code>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts: [app.example.com]
    secretName: tls-secret       # TLS cert stored as Secret
  rules:
  - host: app.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80</code></pre>
      </div>
      <div class="learn-callout learn-callout-note">📝 Ingress only defines the rules. You need an <strong>Ingress Controller</strong> (Nginx, Traefik, AWS ALB, Istio Gateway) to actually implement them. Without a controller, Ingress resources do nothing.</div>`,
    quiz: [
      { q: 'What is required for an Ingress resource to work?', opts: ['A LoadBalancer service', 'An Ingress Controller must be deployed', 'A NodePort service', 'A cloud provider'], ans: 1, exp: 'Ingress resources are just configuration. An Ingress Controller (like Nginx Ingress, Traefik, or AWS ALB Controller) is required to implement and enforce the rules.' },
      { q: 'What layer does Ingress operate at?', opts: ['Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application/HTTP)', 'Layer 2 (Data Link)'], ans: 2, exp: 'Ingress operates at Layer 7 (HTTP/HTTPS) and can make routing decisions based on HTTP host headers and URL paths, unlike Services which operate at L4.' },
    ]
  },
  {
    id: 'network-policy', category: 'networking', title: 'NetworkPolicy', icon: '🔒', level: 'advanced',
    content: `
      <div class="learn-intro">A <strong>NetworkPolicy</strong> is a firewall rule for pods. By default, all pod-to-pod traffic in Kubernetes is allowed. NetworkPolicies restrict this traffic based on labels, namespaces, and ports.</div>
      <div class="learn-section">
        <h3>🛡️ Default Behavior</h3>
        <ul>
          <li>Without any NetworkPolicy: All ingress and egress traffic is allowed</li>
          <li>Once any NetworkPolicy selects a pod: only explicitly allowed traffic is permitted</li>
          <li>Policies are additive: multiple policies merge their rules</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 Example: Allow only frontend → backend</h3>
        <pre><code>apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: backend        # applies to backend pods
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend   # only allow from frontend
    ports:
    - protocol: TCP
      port: 8080</code></pre>
      </div>
      <div class="learn-callout learn-callout-warning">⚠️ NetworkPolicies require a CNI plugin that supports them (Calico, Cilium, Weave). Flannel does NOT enforce NetworkPolicy by default.</div>
      <div class="learn-section">
        <h3>🚫 Deny-All Pattern</h3>
        <pre><code># Deny all ingress to all pods in namespace
spec:
  podSelector: {}   # selects ALL pods
  policyTypes:
  - Ingress</code></pre>
        <p>Start with deny-all, then add explicit allow rules — this is the zero-trust approach.</p>
      </div>`,
    quiz: [
      { q: 'What is the default network behavior in Kubernetes without any NetworkPolicy?', opts: ['All traffic is blocked', 'Only intra-namespace traffic is allowed', 'All pod-to-pod traffic is allowed', 'Only traffic from the internet is blocked'], ans: 2, exp: 'By default, Kubernetes allows all pod-to-pod traffic. NetworkPolicies restrict this — once a policy selects a pod, only explicitly allowed traffic is permitted.' },
    ]
  },
  {
    id: 'cni-dns', category: 'networking', title: 'CNI & DNS', icon: '📡', level: 'intermediate',
    content: `
      <div class="learn-intro">The <strong>Container Network Interface (CNI)</strong> is a specification for network plugins that set up pod networking. <strong>CoreDNS</strong> provides DNS-based service discovery inside the cluster.</div>
      <div class="learn-section">
        <h3>🔌 Popular CNI Plugins</h3>
        <ul>
          <li><strong>Calico</strong> — BGP-based routing, excellent NetworkPolicy support, high performance</li>
          <li><strong>Cilium</strong> — eBPF-based, advanced observability, L7 policy, best for large clusters</li>
          <li><strong>Flannel</strong> — Simple VXLAN overlay, easy setup but limited NetworkPolicy support</li>
          <li><strong>Weave</strong> — Simple mesh, supports encryption</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>🌐 K8s DNS — CoreDNS</h3>
        <p>CoreDNS runs as a Deployment in <code>kube-system</code> and provides DNS resolution for services and pods.</p>
        <pre><code># Service DNS pattern:
&lt;service-name&gt;.&lt;namespace&gt;.svc.cluster.local

# Examples:
my-api.default.svc.cluster.local
postgres.database.svc.cluster.local

# Short form (within same namespace):
my-api
my-api.default</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Pods can also get DNS entries: <code>&lt;pod-ip-dashes&gt;.&lt;namespace&gt;.pod.cluster.local</code> — but this is rarely used. Service DNS is the standard approach.</div>`,
    quiz: [
      { q: 'What is the full DNS name for a service "redis" in namespace "cache"?', opts: ['redis.svc.cluster.local', 'cache.redis.svc.cluster.local', 'redis.cache.svc.cluster.local', 'redis.cache.pod.cluster.local'], ans: 2, exp: 'The full DNS pattern for a service is: <service>.<namespace>.svc.cluster.local. So for service "redis" in namespace "cache" it becomes redis.cache.svc.cluster.local.' },
    ]
  },

  // ===================== CONFIGURATION =====================
  {
    id: 'configmaps', category: 'configuration', title: 'ConfigMaps', icon: '⚙️', level: 'beginner',
    content: `
      <div class="learn-intro">A <strong>ConfigMap</strong> stores non-sensitive configuration data as key-value pairs. It decouples configuration from container images, allowing the same image to run in different environments.</div>
      <div class="learn-section">
        <h3>✏️ Creating ConfigMaps</h3>
        <pre><code># From literals
kubectl create configmap app-config \
  --from-literal=DB_HOST=postgres \
  --from-literal=LOG_LEVEL=info

# From a file
kubectl create configmap nginx-conf \
  --from-file=nginx.conf

# From YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: postgres
  LOG_LEVEL: info
  app.properties: |
    max.connections=100
    timeout=30</code></pre>
      </div>
      <div class="learn-section">
        <h3>📥 Using ConfigMaps in Pods</h3>
        <pre><code># As environment variables
envFrom:
- configMapRef:
    name: app-config

# As a mounted file
volumes:
- name: config-vol
  configMap:
    name: nginx-conf
containers:
- volumeMounts:
  - name: config-vol
    mountPath: /etc/nginx/conf.d</code></pre>
      </div>
      <div class="learn-callout learn-callout-note">📝 Volume-mounted ConfigMaps update automatically when the ConfigMap is changed (eventual consistency ~1 min). Environment variable injection does NOT hot-reload — pod restart required.</div>`,
    quiz: [
      { q: 'Which ConfigMap consumption method supports hot-reloading without pod restart?', opts: ['Environment variables via envFrom', 'Environment variables via env[].valueFrom', 'Volume mounts', 'Command line arguments'], ans: 2, exp: 'Volume-mounted ConfigMaps are automatically updated when the ConfigMap changes (within ~1 minute). Environment variable injection is baked in at pod start and requires a restart to update.' },
    ]
  },
  {
    id: 'secrets', category: 'configuration', title: 'Secrets', icon: '🔐', level: 'intermediate',
    content: `
      <div class="learn-intro">A <strong>Secret</strong> stores sensitive data like passwords, tokens, and TLS certificates. Secrets are base64-encoded in etcd and have additional access controls compared to ConfigMaps.</div>
      <div class="learn-section">
        <h3>⚠️ Security Reality Check</h3>
        <ul>
          <li>Secrets are base64-encoded, NOT encrypted by default</li>
          <li>Anyone with etcd access can read them</li>
          <li>RBAC access to <code>list secrets</code> reveals all secret names and values</li>
          <li>Secrets are distributed to nodes in plaintext unless encryption-at-rest is enabled</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>🔒 Creating & Using Secrets</h3>
        <pre><code># Create (value is auto base64-encoded)
kubectl create secret generic db-creds \
  --from-literal=password=s3cr3t

# TLS secret
kubectl create secret tls my-tls \
  --cert=tls.crt --key=tls.key

# Use in pod
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: db-creds
      key: password

# Decode a secret
kubectl get secret db-creds \
  -o jsonpath="{.data.password}" | base64 -d</code></pre>
      </div>
      <div class="learn-section">
        <h3>🛡️ Production Best Practices</h3>
        <ul>
          <li>Enable <code>EncryptionConfiguration</code> in kube-apiserver for etcd encryption at rest</li>
          <li>Use external secret managers: HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager</li>
          <li>Use <strong>External Secrets Operator</strong> to sync from external stores to K8s secrets</li>
          <li>Restrict RBAC: <code>verbs: [get]</code> but not <code>[list]</code> (listing reveals all secrets)</li>
        </ul>
      </div>`,
    quiz: [
      { q: 'Are Kubernetes Secrets encrypted by default?', opts: ['Yes, they are AES-256 encrypted', 'No, they are only base64-encoded', 'Yes, with RSA encryption', 'No, they are stored in plaintext'], ans: 1, exp: 'By default, Secrets are only base64-encoded — not encrypted. To encrypt at rest, you must configure EncryptionConfiguration in the kube-apiserver.' },
    ]
  },
  {
    id: 'volumes', category: 'configuration', title: 'Volumes & PVs', icon: '💾', level: 'intermediate',
    content: `
      <div class="learn-intro">Kubernetes storage has three layers: <strong>PersistentVolume (PV)</strong> — the actual storage, <strong>PersistentVolumeClaim (PVC)</strong> — a request for storage, and <strong>StorageClass</strong> — dynamic provisioning.</div>
      <div class="learn-section">
        <h3>🗂️ Volume Types</h3>
        <ul>
          <li><strong>emptyDir</strong> — Temporary, tied to pod lifecycle. Deleted when pod ends. Good for scratch space shared between containers.</li>
          <li><strong>hostPath</strong> — Mounts a node filesystem path. Risky (ties pod to node). Used by DaemonSets.</li>
          <li><strong>PersistentVolume</strong> — Lifecycle independent of pods. For stateful production workloads.</li>
          <li><strong>configMap / secret</strong> — Mount config data as files.</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 PVC + Pod Example</h3>
        <pre><code># 1. PVC requests storage
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-storage
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: fast-ssd    # triggers dynamic provisioning
  resources:
    requests:
      storage: 10Gi

# 2. Pod uses the PVC
volumes:
- name: data
  persistentVolumeClaim:
    claimName: my-storage
containers:
- volumeMounts:
  - name: data
    mountPath: /data</code></pre>
      </div>
      <div class="learn-section">
        <h3>🗝️ Access Modes</h3>
        <ul>
          <li><strong>ReadWriteOnce (RWO)</strong> — One node read/write. Most block storage (EBS, PD).</li>
          <li><strong>ReadOnlyMany (ROX)</strong> — Many nodes, read-only.</li>
          <li><strong>ReadWriteMany (RWX)</strong> — Many nodes, read/write. Requires NFS/CephFS/EFS.</li>
        </ul>
      </div>`,
    quiz: [
      { q: 'What happens to an emptyDir volume when a pod is deleted?', opts: ['It persists until explicitly deleted', 'It is deleted with the pod', 'It becomes a PersistentVolume', 'It is moved to another pod'], ans: 1, exp: 'emptyDir volumes are created when a pod is assigned to a node and deleted when that pod is removed. They are temporary scratch space tied to the pod lifecycle.' },
    ]
  },

  // ===================== ADVANCED =====================
  {
    id: 'rbac', category: 'advanced', title: 'RBAC', icon: '🔑', level: 'intermediate',
    content: `
      <div class="learn-intro"><strong>RBAC (Role-Based Access Control)</strong> controls who can do what on which resources in Kubernetes. It is the primary authorization mechanism in K8s clusters.</div>
      <div class="learn-section">
        <h3>🏗️ RBAC Building Blocks</h3>
        <ul>
          <li><strong>Role</strong> — Grants permissions within a specific namespace</li>
          <li><strong>ClusterRole</strong> — Grants permissions cluster-wide (or reusable across namespaces)</li>
          <li><strong>RoleBinding</strong> — Binds a Role/ClusterRole to subjects within a namespace</li>
          <li><strong>ClusterRoleBinding</strong> — Binds a ClusterRole to subjects cluster-wide</li>
          <li><strong>Subjects</strong> — Users, Groups, or ServiceAccounts</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 Example: Developer Role</h3>
        <pre><code># Role: read-only access to pods in "dev" namespace
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: dev
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]

---
# Bind the role to a user
kind: RoleBinding
metadata:
  name: read-pods
  namespace: dev
subjects:
- kind: User
  name: developer1
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Test permissions with: <code>kubectl auth can-i create pods --as=developer1 -n dev</code></div>`,
    quiz: [
      { q: 'What is the difference between a Role and a ClusterRole?', opts: ['No difference', 'Role is namespaced; ClusterRole is cluster-wide', 'ClusterRole is more secure', 'Role applies to all namespaces'], ans: 1, exp: 'Role grants permissions within a specific namespace. ClusterRole grants cluster-wide permissions OR can be reused across namespaces via RoleBindings.' },
    ]
  },
  {
    id: 'probes', category: 'advanced', title: 'Probes & Health', icon: '❤️', level: 'intermediate',
    content: `
      <div class="learn-intro">Kubernetes uses three types of probes to determine the health of containers. Proper probe configuration is critical for zero-downtime deployments and self-healing.</div>
      <div class="learn-section">
        <h3>🩺 The Three Probes</h3>
        <ul>
          <li><strong>Liveness Probe</strong> — Is the container still alive? If it fails: kubelet <strong>restarts</strong> the container.</li>
          <li><strong>Readiness Probe</strong> — Is the container ready to serve traffic? If it fails: pod is removed from Service endpoints (no traffic).</li>
          <li><strong>Startup Probe</strong> — Has the container finished starting? Disables liveness/readiness during startup. Essential for slow-starting apps.</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📄 Probe Configuration</h3>
        <pre><code>livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 30  # wait before first check
  periodSeconds: 10        # check every 10s
  failureThreshold: 3      # fail 3 times → restart

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5

startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30     # 30 * 10s = 5min to start
  periodSeconds: 10</code></pre>
      </div>
      <div class="learn-callout learn-callout-warning">⚠️ Common mistakes: <br>• Liveness probe checks external dependencies (DB) → cascading restarts when DB is slow<br>• No readiness probe → traffic hits pods before they're ready → 502 errors during deploys</div>`,
    quiz: [
      { q: 'What happens when a Readiness probe fails?', opts: ['The container is restarted', 'The pod is deleted', 'The pod is removed from Service endpoints (no traffic)', 'A new pod is created'], ans: 2, exp: 'A failing readiness probe causes the pod to be removed from the Service\'s list of endpoints, stopping traffic to it. The pod is NOT restarted — it just stops receiving traffic until the probe passes again.' },
      { q: 'When should you use a Startup probe?', opts: ['Always, for all apps', 'For slow-starting apps that need extra time before liveness checks begin', 'Instead of liveness probes', 'Only for databases'], ans: 1, exp: 'Startup probes are ideal for applications with long initialization times (legacy apps, ML models). They give the app time to start before the liveness probe begins checking, preventing premature restarts.' },
    ]
  },
  {
    id: 'scheduling', category: 'advanced', title: 'Scheduling & Taints', icon: '📅', level: 'advanced',
    content: `
      <div class="learn-intro">Kubernetes scheduling determines which node each pod runs on. You can influence scheduling using <strong>Node Selectors</strong>, <strong>Affinity/Anti-Affinity</strong>, <strong>Taints</strong>, and <strong>Tolerations</strong>.</div>
      <div class="learn-section">
        <h3>🚧 Taints & Tolerations</h3>
        <p><strong>Taints</strong> repel pods from nodes. <strong>Tolerations</strong> allow pods to be scheduled on tainted nodes.</p>
        <pre><code># Taint a node (repel all pods without toleration)
kubectl taint nodes gpu-node dedicated=gpu:NoSchedule

# Toleration in pod spec
tolerations:
- key: "dedicated"
  operator: "Equal"
  value: "gpu"
  effect: "NoSchedule"</code></pre>
        <p>Taint effects: <code>NoSchedule</code>, <code>PreferNoSchedule</code>, <code>NoExecute</code> (evicts existing pods)</p>
      </div>
      <div class="learn-section">
        <h3>🎯 Pod Anti-Affinity (spread across nodes)</h3>
        <pre><code>affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - labelSelector:
        matchLabels:
          app: web
      topologyKey: kubernetes.io/hostname  # different nodes</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Master/control-plane nodes are tainted with <code>node-role.kubernetes.io/control-plane:NoSchedule</code> — that's why user workloads don't land on them by default.</div>`,
    quiz: [
      { q: 'What does a NoExecute taint effect do?', opts: ['Prevents new pods from scheduling only', 'Evicts existing pods that do not tolerate the taint', 'Makes scheduling optional (soft)', 'Has no effect on running pods'], ans: 1, exp: 'NoExecute both prevents new pods from scheduling AND evicts existing pods that don\'t have a matching toleration. NoSchedule only prevents new scheduling without evicting existing pods.' },
    ]
  },
  {
    id: 'helm', category: 'advanced', title: 'Helm Charts', icon: '⛵', level: 'intermediate',
    content: `
      <div class="learn-intro"><strong>Helm</strong> is the package manager for Kubernetes. It bundles all the K8s manifests for an application into a reusable, versioned <strong>Chart</strong>.</div>
      <div class="learn-section">
        <h3>📦 Core Concepts</h3>
        <ul>
          <li><strong>Chart</strong> — A packaged application (like an apt/npm package). Contains templates + default values.</li>
          <li><strong>Release</strong> — A deployed instance of a chart. You can have multiple releases of the same chart.</li>
          <li><strong>Values</strong> — Configuration that overrides chart defaults (via <code>values.yaml</code> or <code>--set</code>).</li>
          <li><strong>Repository</strong> — Collection of charts. Popular: Artifact Hub, Bitnami.</li>
        </ul>
      </div>
      <div class="learn-section">
        <h3>📋 Essential Commands</h3>
        <pre><code># Add a repo and install a chart
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install my-postgres bitnami/postgresql \
  --set auth.password=mysecret \
  -f custom-values.yaml

# Upgrade & rollback
helm upgrade my-postgres bitnami/postgresql --set image.tag=15
helm rollback my-postgres 1

# List and uninstall
helm list -A
helm uninstall my-postgres</code></pre>
      </div>
      <div class="learn-section">
        <h3>📁 Chart Structure</h3>
        <pre><code>mychart/
  Chart.yaml          # chart metadata (name, version)
  values.yaml         # default configuration values
  templates/          # K8s manifest templates
    deployment.yaml
    service.yaml
    _helpers.tpl      # reusable template snippets
  charts/             # sub-chart dependencies</code></pre>
      </div>
      <div class="learn-callout learn-callout-tip">💡 Helm 3 removed Tiller (the server-side component from Helm 2) which was a major security risk. Helm now runs entirely client-side using your kubeconfig credentials.</div>`,
    quiz: [
      { q: 'What is a Helm Release?', opts: ['A new version of Helm itself', 'A specific deployed instance of a Helm chart', 'A Git tag for chart code', 'A Helm repository update'], ans: 1, exp: 'A Helm Release is a specific deployment of a chart to a cluster. You can have multiple releases (myapp-staging, myapp-prod) from the same chart with different values.' },
    ]
  },
  {
    id: 'troubleshooting', category: 'advanced', title: 'Troubleshooting', icon: '🔧', level: 'intermediate',
    content: `
      <div class="learn-intro">Systematic troubleshooting is a key DevOps skill. Most Kubernetes issues fall into 4 categories: scheduling failures, container failures, networking issues, and resource exhaustion.</div>
      <div class="learn-section">
        <h3>🔍 Diagnostic Command Toolkit</h3>
        <pre><code># Step 1: Check pod status
kubectl get pods -o wide
kubectl describe pod &lt;pod&gt;     # check Events section!

# Step 2: Check logs
kubectl logs &lt;pod&gt;
kubectl logs &lt;pod&gt; --previous  # previous container logs

# Step 3: Check resources
kubectl top nodes
kubectl top pods

# Step 4: Check events
kubectl get events --sort-by=.lastTimestamp -n &lt;ns&gt;</code></pre>
      </div>
      <div class="learn-section">
        <h3>🚨 Common Issues & Fixes</h3>
        <ul>
          <li><strong>Pending</strong> — Insufficient resources / affinity mismatch / PVC not bound. Check <code>describe pod</code> Events.</li>
          <li><strong>CrashLoopBackOff</strong> — App crashing. Check <code>logs --previous</code>. Look at exit code (137=OOM, 1=app error).</li>
          <li><strong>ImagePullBackOff</strong> — Wrong image name or missing imagePullSecret.</li>
          <li><strong>OOMKilled</strong> — Container exceeded memory limit. Increase limit or fix memory leak.</li>
          <li><strong>Terminating stuck</strong> — Pod has finalizers blocking deletion. Check <code>describe pod</code>.</li>
        </ul>
      </div>
      <div class="learn-callout learn-callout-tip">💡 The <strong>Events</strong> section in <code>kubectl describe pod</code> tells you exactly why a pod is failing. Always start there before diving into logs.</div>`,
    quiz: [
      { q: 'A pod shows exit code 137. What does this indicate?', opts: ['Application error (uncaught exception)', 'OOM Killed — container exceeded memory limit', 'Segmentation fault', 'Container was gracefully terminated'], ans: 1, exp: 'Exit code 137 = 128 + 9 (SIGKILL). In Kubernetes this almost always means the container was Out-Of-Memory (OOM) killed by the kubelet for exceeding its memory limit.' },
      { q: 'What is the best first step when a pod is stuck in CrashLoopBackOff?', opts: ['Delete and recreate the pod', 'kubectl logs &lt;pod&gt; --previous to see the crash logs', 'Scale down the deployment', 'Restart the node'], ans: 1, exp: 'kubectl logs --previous shows the logs from the last crashed container instance, which usually reveals the error code or exception that caused the crash.' },
    ]
  },
];
