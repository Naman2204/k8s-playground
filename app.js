// ============================================================
//  K8s Playground — Application Logic
// ============================================================

// ---- UTILS ----
function $(id) { return document.getElementById(id); }
function toast(msg, type = 'info', dur = 3000) {
    const c = $('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
    c.appendChild(el);
    setTimeout(() => { el.classList.add('dismissing'); setTimeout(() => el.remove(), 300); }, dur);
}

// ---- PARTICLES ----
function initParticles() {
    const container = $('particles');
    const colors = ['#326CE5', '#00D4FF', '#7c3aed', '#22c55e'];
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 6 + 2;
        p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 20 + 15}s;
      animation-delay:-${Math.random() * 20}s;
    `;
        container.appendChild(p);
    }
}

// ---- NAVBAR ----
function initNav() {
    const links = document.querySelectorAll('.nav-link');
    const sections = ['terminal', 'commands', 'architecture', 'quiz', 'interview'];
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.id;
                links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(s => { const el = $(s); if (el) obs.observe(el); });

    $('nav-toggle').addEventListener('click', () => {
        document.querySelector('.nav-links').style.display =
            document.querySelector('.nav-links').style.display === 'flex' ? 'none' : 'flex';
    });

    $('reset-btn').addEventListener('click', () => {
        if (confirm('Reset all progress? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    });
}

// ---- TERMINAL SIMULATOR ----
const TERMINAL_DB = {
    'help': () => `<div class="term-output"><span class="term-header">Available kubectl commands:</span>
<span class="term-comment">─────────────────────────────────────────────────</span>
<span class="term-success">📦 Pods:</span>        get pods, describe pod, logs, exec, delete pod
<span class="term-success">🚀 Deployments:</span> get deployments, scale, rollout status, rollout undo
<span class="term-success">🔗 Services:</span>    get services, expose, port-forward
<span class="term-success">🗂️  Namespaces:</span>  get namespaces, config set-context
<span class="term-success">⚙️  Config:</span>      get configmaps, get secrets, apply, describe
<span class="term-success">💾 Storage:</span>     get pv, get pvc, get storageclass
<span class="term-success">📋 Info:</span>        cluster-info, top nodes, top pods, get events
<span class="term-comment">─────────────────────────────────────────────────</span>
<span class="term-info">Type any kubectl command. Example: kubectl get pods</span>
<span class="term-info">Type "tutorial" to start a guided walkthrough.</span></div>`,

    'tutorial': () => `<div class="term-output"><span class="term-header">🎓 K8s Tutorial — Getting Started</span>
<span class="term-comment">Step 1:</span> <span class="term-highlight">kubectl cluster-info</span>     — see your cluster endpoints
<span class="term-comment">Step 2:</span> <span class="term-highlight">kubectl get nodes</span>        — list nodes in your cluster
<span class="term-comment">Step 3:</span> <span class="term-highlight">kubectl get namespaces</span>   — list namespaces
<span class="term-comment">Step 4:</span> <span class="term-highlight">kubectl get pods</span>         — list pods in default ns
<span class="term-comment">Step 5:</span> <span class="term-highlight">kubectl get deployments</span>  — see running deployments
<span class="term-comment">Step 6:</span> <span class="term-highlight">kubectl get services</span>     — list services & ClusterIPs
<span class="term-info">Try each command above to explore!</span></div>`,

    'kubectl cluster-info': () => `<div class="term-output"><span class="term-success">Kubernetes control plane</span> is running at <span class="term-highlight">https://192.168.49.2:8443</span>
<span class="term-success">CoreDNS</span> is running at <span class="term-highlight">https://192.168.49.2:8443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy</span>
<span class="term-info">To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.</span></div>`,

    'kubectl get nodes': () => `<div class="term-output"><span class="term-header">NAME                STATUS   ROLES           AGE    VERSION</span>
<span class="term-row"><span class="col name">playground-master</span><span class="col status-ok">Ready</span>    <span class="col muted">control-plane</span>   <span class="col muted">42d</span>    <span class="col muted">v1.28.0</span></span>
<span class="term-row"><span class="col name">playground-node1</span> <span class="col status-ok">Ready</span>    <span class="col muted">&lt;none&gt;</span>          <span class="col muted">42d</span>    <span class="col muted">v1.28.0</span></span>
<span class="term-row"><span class="col name">playground-node2</span> <span class="col status-ok">Ready</span>    <span class="col muted">&lt;none&gt;</span>          <span class="col muted">42d</span>    <span class="col muted">v1.28.0</span></span>
<span class="term-row"><span class="col name">playground-node3</span> <span class="col status-ok">Ready</span>    <span class="col muted">&lt;none&gt;</span>          <span class="col muted">15d</span>    <span class="col muted">v1.28.0</span></span></div>`,

    'kubectl get nodes -o wide': () => `<div class="term-output"><span class="term-header">NAME                STATUS  ROLES          AGE  VERSION   INTERNAL-IP     OS-IMAGE          CONTAINER-RUNTIME</span>
<span class="term-row"><span class="col name">playground-master</span> <span class="col status-ok">Ready</span> <span class="col muted">control-plane</span> <span class="col muted">42d</span> <span class="col muted">v1.28.0</span> <span class="col muted">192.168.49.2</span>   <span class="col muted">Ubuntu 22.04</span> <span class="col muted">containerd://1.6.21</span></span>
<span class="term-row"><span class="col name">playground-node1</span>  <span class="col status-ok">Ready</span> <span class="col muted">&lt;none&gt;</span>         <span class="col muted">42d</span> <span class="col muted">v1.28.0</span> <span class="col muted">192.168.49.3</span>   <span class="col muted">Ubuntu 22.04</span> <span class="col muted">containerd://1.6.21</span></span></div>`,

    'kubectl get namespaces': () => `<div class="term-output"><span class="term-header">NAME              STATUS   AGE</span>
<span class="term-row"><span class="col name">default</span>           <span class="col status-ok">Active</span>   42d</span>
<span class="term-row"><span class="col name">kube-system</span>       <span class="col status-ok">Active</span>   42d</span>
<span class="term-row"><span class="col name">kube-public</span>       <span class="col status-ok">Active</span>   42d</span>
<span class="term-row"><span class="col name">kube-node-lease</span>   <span class="col status-ok">Active</span>   42d</span>
<span class="term-row"><span class="col name">monitoring</span>        <span class="col status-ok">Active</span>   30d</span>
<span class="term-row"><span class="col name">staging</span>           <span class="col status-ok">Active</span>   20d</span>
<span class="term-row"><span class="col name">production</span>        <span class="col status-ok">Active</span>   15d</span></div>`,

    'kubectl get pods': () => `<div class="term-output"><span class="term-header">NAME                              READY   STATUS    RESTARTS   AGE</span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84-xk2p9</span>      <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span>          <span class="col muted">2d</span></span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84-m92qs</span>      <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span>          <span class="col muted">2d</span></span>
<span class="term-row"><span class="col name">backend-api-5f4d9d7c8-r4k7p</span>      <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">1</span>          <span class="col muted">5d</span></span>
<span class="term-row"><span class="col name">redis-0</span>                           <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span>          <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">postgres-0</span>                        <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span>          <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">debug-pod</span>                         <span class="col muted">0/1</span>     <span class="col status-bad">CrashLoopBackOff</span>   <span class="col status-bad">5</span>  <span class="col muted">1h</span></span></div>`,

    'kubectl get deployments': () => `<div class="term-output"><span class="term-header">NAME           READY   UP-TO-DATE   AVAILABLE   AGE</span>
<span class="term-row"><span class="col name">nginx-deploy</span>   <span class="col status-ok">3/3</span>     <span class="col muted">3</span>            <span class="col status-ok">3</span>           <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">backend-api</span>    <span class="col status-ok">2/2</span>     <span class="col muted">2</span>            <span class="col status-ok">2</span>           <span class="col muted">5d</span></span>
<span class="term-row"><span class="col name">frontend</span>       <span class="col muted">1/3</span>     <span class="col muted">3</span>            <span class="col status-bad">1</span>           <span class="col muted">2h</span></span></div>`,

    'kubectl get services': () => `<div class="term-output"><span class="term-header">NAME           TYPE           CLUSTER-IP       EXTERNAL-IP      PORT(S)          AGE</span>
<span class="term-row"><span class="col name">kubernetes</span>     <span class="col muted">ClusterIP</span>      <span class="col muted">10.96.0.1</span>        <span class="col muted">&lt;none&gt;</span>           <span class="col muted">443/TCP</span>          <span class="col muted">42d</span></span>
<span class="term-row"><span class="col name">nginx-svc</span>      <span class="col muted">LoadBalancer</span>   <span class="col muted">10.100.200.1</span>     <span class="col highlight">35.232.10.5</span>      <span class="col muted">80:31200/TCP</span>      <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">backend-svc</span>    <span class="col muted">ClusterIP</span>      <span class="col muted">10.100.200.50</span>    <span class="col muted">&lt;none&gt;</span>           <span class="col muted">8080/TCP</span>         <span class="col muted">5d</span></span>
<span class="term-row"><span class="col name">redis</span>          <span class="col muted">ClusterIP</span>      <span class="col muted">10.100.200.99</span>    <span class="col muted">&lt;none&gt;</span>           <span class="col muted">6379/TCP</span>         <span class="col muted">10d</span></span></div>`,

    'kubectl get configmaps': () => `<div class="term-output"><span class="term-header">NAME                  DATA   AGE</span>
<span class="term-row"><span class="col name">app-config</span>            <span class="col muted">5</span>      <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">nginx-config</span>          <span class="col muted">2</span>      <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">kube-root-ca.crt</span>      <span class="col muted">1</span>      <span class="col muted">42d</span></span></div>`,

    'kubectl get secrets': () => `<div class="term-output"><span class="term-header">NAME                  TYPE                                  DATA   AGE</span>
<span class="term-row"><span class="col name">db-secret</span>             <span class="col muted">Opaque</span>                                <span class="col muted">3</span>      <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">tls-secret</span>            <span class="col muted">kubernetes.io/tls</span>                     <span class="col muted">2</span>      <span class="col muted">30d</span></span>
<span class="term-row"><span class="col name">default-token</span>         <span class="col muted">kubernetes.io/service-account-token</span>   <span class="col muted">3</span>      <span class="col muted">42d</span></span></div>`,

    'kubectl get pv': () => `<div class="term-output"><span class="term-header">NAME          CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                STORAGECLASS   AGE</span>
<span class="term-row"><span class="col name">pv-postgres</span>   <span class="col muted">20Gi</span>       <span class="col muted">RWO</span>            <span class="col muted">Retain</span>           <span class="col status-ok">Bound</span>    <span class="col muted">default/postgres-pvc</span> <span class="col muted">gp2</span>            <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">pv-redis</span>      <span class="col muted">5Gi</span>        <span class="col muted">RWO</span>            <span class="col muted">Delete</span>           <span class="col status-ok">Bound</span>    <span class="col muted">default/redis-pvc</span>    <span class="col muted">gp2</span>            <span class="col muted">10d</span></span></div>`,

    'kubectl get pvc': () => `<div class="term-output"><span class="term-header">NAME           STATUS   VOLUME        CAPACITY   ACCESS MODES   STORAGECLASS   AGE</span>
<span class="term-row"><span class="col name">postgres-pvc</span>   <span class="col status-ok">Bound</span>    <span class="col muted">pv-postgres</span>   <span class="col muted">20Gi</span>       <span class="col muted">RWO</span>            <span class="col muted">gp2</span>            <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">redis-pvc</span>      <span class="col status-ok">Bound</span>    <span class="col muted">pv-redis</span>      <span class="col muted">5Gi</span>        <span class="col muted">RWO</span>            <span class="col muted">gp2</span>            <span class="col muted">10d</span></span></div>`,

    'kubectl top nodes': () => `<div class="term-output"><span class="term-header">NAME                CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%</span>
<span class="term-row"><span class="col name">playground-master</span>   <span class="col muted">185m</span>         <span class="col status-ok">9%</span>     <span class="col muted">1342Mi</span>          <span class="col muted">35%</span></span>
<span class="term-row"><span class="col name">playground-node1</span>    <span class="col muted">430m</span>         <span class="col status-ok">21%</span>    <span class="col muted">2100Mi</span>          <span class="col muted">54%</span></span>
<span class="term-row"><span class="col name">playground-node2</span>    <span class="col muted">795m</span>         <span class="col status-bad">39%</span>    <span class="col muted">3400Mi</span>          <span class="col muted">87%</span></span></div>`,

    'kubectl get events': () => `<div class="term-output"><span class="term-header">LAST SEEN   TYPE      REASON              OBJECT                          MESSAGE</span>
<span class="term-row"><span class="col muted">2m</span>          <span class="col status-ok">Normal</span>    <span class="col muted">Scheduled</span>           <span class="col name">pod/nginx-deploy-xk2p9</span>          <span class="col muted">Successfully assigned default/nginx-deploy-xk2p9 to playground-node1</span></span>
<span class="term-row"><span class="col muted">2m</span>          <span class="col status-ok">Normal</span>    <span class="col muted">Pulled</span>              <span class="col name">pod/nginx-deploy-xk2p9</span>          <span class="col muted">Container image "nginx:latest" already present</span></span>
<span class="term-row"><span class="col muted">1m</span>          <span class="col status-bad">Warning</span>   <span class="col muted">BackOff</span>             <span class="col name">pod/debug-pod</span>                   <span class="col muted">Back-off restarting failed container</span></span>
<span class="term-row"><span class="col muted">5m</span>          <span class="col status-bad">Warning</span>   <span class="col muted">OOMKilling</span>          <span class="col name">node/playground-node2</span>           <span class="col muted">Memory cgroup out of memory</span></span></div>`,

    'kubectl rollout status deployment/myapp': () => `<div class="term-output"><span class="term-success">Waiting for deployment "myapp" rollout to finish: 1 out of 3 new replicas have been updated...</span>
<span class="term-success">Waiting for deployment "myapp" rollout to finish: 2 out of 3 new replicas have been updated...</span>
<span class="term-success">Waiting for deployment "myapp" rollout to finish: 1 old replicas are pending termination...</span>
<span class="term-success">deployment "myapp" successfully rolled out</span></div>`,

    'kubectl rollout history deployment/myapp': () => `<div class="term-output"><span class="term-header">REVISION  CHANGE-CAUSE</span>
<span class="term-row"><span class="col muted">1</span>         <span class="col muted">kubectl create deployment myapp --image=nginx:1.19</span></span>
<span class="term-row"><span class="col muted">2</span>         <span class="col muted">kubectl set image deployment/myapp nginx=nginx:1.20</span></span>
<span class="term-row"><span class="col muted">3</span>         <span class="col highlight">kubectl set image deployment/myapp nginx=nginx:1.21</span></span></div>`,

    'kubectl get storageclass': () => `<div class="term-output"><span class="term-header">NAME            PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE</span>
<span class="term-row"><span class="col name">gp2 (default)</span>   <span class="col muted">kubernetes.io/aws-ebs</span>   <span class="col muted">Delete</span>          <span class="col muted">WaitForFirstConsumer</span>   <span class="col status-ok">true</span>                   <span class="col muted">42d</span></span>
<span class="term-row"><span class="col name">gp3</span>             <span class="col muted">ebs.csi.aws.com</span>         <span class="col muted">Delete</span>          <span class="col muted">WaitForFirstConsumer</span>   <span class="col status-ok">true</span>                   <span class="col muted">30d</span></span></div>`,
};

// ---- PATTERN-BASED TERMINAL MATCHING ----
// Each entry: { pattern: RegExp, fn: (match, cmd) => htmlString }
const TERMINAL_PATTERNS = [
    // kubectl logs <pod> [flags]
    {
        pattern: /^kubectl logs (-f\s+)?(\S+)(\s+.*)?$/,
        fn: (m, cmd) => {
            const follow = m[1] ? '<span class="term-info">(Streaming logs — press Ctrl+C to stop)</span>\n' : '';
            const pod = m[2];
            if (pod === 'debug-pod') {
                return `<div class="term-output">${follow}<span class="term-error">panic: runtime error: invalid memory address or nil pointer dereference</span>
<span class="term-error">goroutine 1 [running]:</span>
<span class="term-error">main.main()</span>
<span class="term-error">	/app/main.go:42 +0x58</span>
<span class="term-info">Exit code: 2  (container crashed — use "kubectl logs debug-pod --previous" to see prior crash logs)</span></div>`;
            }
            return `<div class="term-output">${follow}<span class="term-muted">[${new Date().toISOString()}]</span> <span class="term-success">INFO</span>  Starting application on pod <span class="term-highlight">${escapeHtml(pod)}</span>
<span class="term-muted">[${new Date().toISOString()}]</span> <span class="term-success">INFO</span>  Listening on :8080
<span class="term-muted">[${new Date().toISOString()}]</span> <span class="term-success">INFO</span>  Health check passed
<span class="term-muted">[${new Date().toISOString()}]</span> <span class="term-success">INFO</span>  Connected to database
<span class="term-muted">[${new Date().toISOString()}]</span> <span class="term-success">INFO</span>  Ready to serve requests</div>`;
        }
    },
    // kubectl logs <pod> --previous
    {
        pattern: /^kubectl logs (\S+) --previous$/,
        fn: (m) => `<div class="term-output"><span class="term-error">Error from server: previous terminated container not found</span>
<span class="term-info"># Pod "${escapeHtml(m[1])}" has no previous container. It may not have crashed yet.</span></div>`
    },
    // kubectl describe pod <name>
    {
        pattern: /^kubectl describe (pod|po) (\S+)(\s+.*)?$/,
        fn: (m) => {
            const name = m[2];
            const isBroken = name === 'debug-pod';
            return `<div class="term-output"><span class="term-header">Name:         ${escapeHtml(name)}</span>
<span class="term-muted">Namespace:    default</span>
<span class="term-muted">Node:         playground-node1/192.168.49.3</span>
<span class="term-muted">Start Time:   Sat, 07 Mar 2026 10:00:00 +0530</span>
<span class="term-muted">Labels:       app=${escapeHtml(name)}</span>
<span class="term-muted">Status:       <span class="${isBroken ? 'term-error' : 'term-success'}">${isBroken ? 'CrashLoopBackOff' : 'Running'}</span>
IP:           10.244.1.${Math.floor(Math.random() * 200 + 10)}</span>
<span class="term-header">Containers:</span>
<span class="term-muted">  ${escapeHtml(name)}:</span>
<span class="term-muted">    Image:      nginx:latest</span>
<span class="term-muted">    Port:       8080/TCP</span>
<span class="term-muted">    Limits:     cpu: 500m  memory: 256Mi</span>
<span class="term-muted">    Requests:   cpu: 250m  memory: 128Mi</span>
<span class="${isBroken ? 'term-error' : 'term-success'}">    Ready:      ${isBroken ? 'False' : 'True'}</span>
<span class="${isBroken ? 'term-error' : 'term-muted'}">    Restart Count: ${isBroken ? '5' : '0'}</span>
<span class="term-header">Conditions:</span>
<span class="${isBroken ? 'term-error' : 'term-success'}">  Ready       ${isBroken ? 'False' : 'True'}</span>
<span class="term-header">Events:</span>
${isBroken
                    ? `<span class="term-error">  Warning  BackOff   1m   Back-off restarting failed container debug-pod</span>
<span class="term-error">  Warning  Failed    2m   Error: container exited with code 2 (panic: nil pointer dereference)</span>`
                    : `<span class="term-success">  Normal   Pulled    5m   Successfully pulled image "nginx:latest"</span>
<span class="term-success">  Normal   Created   5m   Created container ${escapeHtml(name)}</span>
<span class="term-success">  Normal   Started   5m   Started container ${escapeHtml(name)}</span>`
                }</div>`;
        }
    },
    // kubectl describe node <name>
    {
        pattern: /^kubectl describe (node|no) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-header">Name:         ${escapeHtml(m[2])}</span>
<span class="term-muted">Roles:        <none></span>
<span class="term-muted">Labels:       kubernetes.io/arch=amd64  kubernetes.io/os=linux</span>
<span class="term-header">Conditions:</span>
<span class="term-success">  MemoryPressure   False   KubeletHasSufficientMemory</span>
<span class="term-success">  DiskPressure     False   KubeletHasNoDiskPressure</span>
<span class="term-success">  PIDPressure      False   KubeletHasSufficientPID</span>
<span class="term-success">  Ready            True    KubeletReady</span>
<span class="term-header">Capacity:</span>
<span class="term-muted">  cpu:              4</span>
<span class="term-muted">  memory:           8000Mi</span>
<span class="term-muted">  pods:             110</span>
<span class="term-header">Allocatable:</span>
<span class="term-muted">  cpu:              3800m</span>
<span class="term-muted">  memory:           7500Mi</span>
<span class="term-header">Non-terminated Pods: (4 in total)</span>
<span class="term-muted">  nginx-deploy-7d6d9f84-xk2p9    250m    128Mi</span>
<span class="term-muted">  backend-api-5f4d9d7c8-r4k7p    250m    128Mi</span></div>`
    },
    // kubectl describe deployment/deploy <name>
    {
        pattern: /^kubectl describe (deployment|deploy) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-header">Name:               ${escapeHtml(m[2])}</span>
<span class="term-muted">Namespace:          default</span>
<span class="term-muted">Selector:           app=${escapeHtml(m[2])}</span>
<span class="term-muted">Replicas:           3 desired | 3 updated | 3 total | 3 available | 0 unavailable</span>
<span class="term-muted">StrategyType:       RollingUpdate</span>
<span class="term-muted">RollingUpdateStrategy: 25% max unavailable, 25% max surge</span>
<span class="term-header">Pod Template:</span>
<span class="term-muted">  Labels: app=${escapeHtml(m[2])}</span>
<span class="term-muted">  Containers:</span>
<span class="term-muted">    Image: nginx:latest</span>
<span class="term-muted">    Port:  80/TCP</span>
<span class="term-header">Conditions:</span>
<span class="term-success">  Available   True   MinimumReplicasAvailable</span>
<span class="term-success">  Progressing True   NewReplicaSetAvailable</span>
<span class="term-header">Events:</span>
<span class="term-success">  Normal  ScalingReplicaSet  10d  Scaled up replica set ${escapeHtml(m[2])}-7d6d9f84 to 3</span></div>`
    },
    // kubectl describe service/svc <name>
    {
        pattern: /^kubectl describe (service|svc) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-header">Name:              ${escapeHtml(m[2])}</span>
<span class="term-muted">Namespace:         default</span>
<span class="term-muted">Selector:          app=${escapeHtml(m[2])}</span>
<span class="term-muted">Type:              ClusterIP</span>
<span class="term-muted">IP:                10.100.200.55</span>
<span class="term-muted">Port:              http  80/TCP</span>
<span class="term-muted">TargetPort:        8080/TCP</span>
<span class="term-header">Endpoints:         10.244.1.12:8080, 10.244.2.8:8080</span>
<span class="term-success">Session Affinity:  None</span></div>`
    },
    // kubectl get pod <name> -o yaml
    {
        pattern: /^kubectl get (pod|po) (\S+)\s+-o\s+yaml$/,
        fn: (m) => {
            const name = m[2];
            return `<div class="term-output"><span class="term-highlight">apiVersion: v1</span>
<span class="term-highlight">kind: Pod</span>
<span class="term-muted">metadata:</span>
<span class="term-muted">  name: ${escapeHtml(name)}</span>
<span class="term-muted">  namespace: default</span>
<span class="term-muted">  labels:</span>
<span class="term-muted">    app: ${escapeHtml(name)}</span>
<span class="term-muted">spec:</span>
<span class="term-muted">  containers:</span>
<span class="term-muted">  - name: ${escapeHtml(name)}</span>
<span class="term-muted">    image: nginx:latest</span>
<span class="term-muted">    ports:</span>
<span class="term-muted">    - containerPort: 8080</span>
<span class="term-muted">    resources:</span>
<span class="term-muted">      requests:</span>
<span class="term-muted">        cpu: "250m"</span>
<span class="term-muted">        memory: "128Mi"</span>
<span class="term-muted">      limits:</span>
<span class="term-muted">        cpu: "500m"</span>
<span class="term-muted">        memory: "256Mi"</span>
<span class="term-muted">status:</span>
<span class="${name === 'debug-pod' ? 'term-error' : 'term-success'}">  phase: ${name === 'debug-pod' ? 'Failed' : 'Running'}</span></div>`;
        }
    },
    // kubectl get pod <name> -o json
    {
        pattern: /^kubectl get (pod|po) (\S+)\s+-o\s+json$/,
        fn: (m) => {
            const name = m[2];
            return `<div class="term-output"><span class="term-highlight">{</span>
<span class="term-muted">  "apiVersion": "v1",</span>
<span class="term-muted">  "kind": "Pod",</span>
<span class="term-muted">  "metadata": { "name": "${escapeHtml(name)}", "namespace": "default" },</span>
<span class="term-muted">  "spec": { "containers": [{ "name": "${escapeHtml(name)}", "image": "nginx:latest" }] },</span>
<span class="${name === 'debug-pod' ? 'term-error' : 'term-success'}">  "status": { "phase": "${name === 'debug-pod' ? 'Failed' : 'Running'}" }</span>
<span class="term-highlight">}</span></div>`;
        }
    },
    // kubectl get pod <name> -o wide  OR  kubectl get pods -o wide
    {
        pattern: /^kubectl get (pod|pods|po)\s*(\S+)?\s*-o\s*wide$/,
        fn: (m) => `<div class="term-output"><span class="term-header">NAME                              READY   STATUS    RESTARTS   AGE   IP            NODE</span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84-xk2p9</span> <span class="col muted">1/1</span> <span class="col status-ok">Running</span> <span class="col muted">0</span> <span class="col muted">2d</span> <span class="col muted">10.244.1.10</span> <span class="col muted">playground-node1</span></span>
<span class="term-row"><span class="col name">backend-api-5f4d9d7c8-r4k7p</span> <span class="col muted">1/1</span> <span class="col status-ok">Running</span> <span class="col muted">1</span> <span class="col muted">5d</span> <span class="col muted">10.244.2.8</span>  <span class="col muted">playground-node2</span></span>
<span class="term-row"><span class="col name">redis-0</span>                     <span class="col muted">1/1</span> <span class="col status-ok">Running</span> <span class="col muted">0</span> <span class="col muted">10d</span> <span class="col muted">10.244.1.15</span> <span class="col muted">playground-node1</span></span>
<span class="term-row"><span class="col name">debug-pod</span>                   <span class="col muted">0/1</span> <span class="col status-bad">CrashLoopBackOff</span> <span class="col status-bad">5</span> <span class="col muted">1h</span> <span class="col muted">10.244.2.20</span> <span class="col muted">playground-node2</span></span></div>`
    },
    // kubectl get pod <name> (single pod)
    {
        pattern: /^kubectl get (pod|po) (\S+)$/,
        fn: (m) => {
            const name = m[2];
            const isBroken = name === 'debug-pod';
            return `<div class="term-output"><span class="term-header">NAME        READY   STATUS    RESTARTS   AGE</span>
<span class="term-row"><span class="col name">${escapeHtml(name)}</span> <span class="col muted">${isBroken ? '0/1' : '1/1'}</span> <span class="${isBroken ? 'col status-bad' : 'col status-ok'}">${isBroken ? 'CrashLoopBackOff' : 'Running'}</span> <span class="col muted">${isBroken ? '5' : '0'}</span> <span class="col muted">2d</span></span></div>`;
        }
    },
    // kubectl exec -it <pod> -- <cmd>
    {
        pattern: /^kubectl exec (-it\s+|-i\s+-t\s+)?(\S+)\s+--\s+(.+)$/,
        fn: (m) => {
            const pod = m[2];
            const shell = m[3];
            if (pod === 'debug-pod') return `<div class="term-output"><span class="term-error">Error from server: error dialing backend: EOF\npod "${escapeHtml(pod)}" is not running (CrashLoopBackOff)</span></div>`;
            return `<div class="term-output"><span class="term-success">Defaulted container "${escapeHtml(pod)}" out of: ${escapeHtml(pod)}</span>
<span class="term-info">(Opened interactive shell in pod ${escapeHtml(pod)} — in a real cluster you would be inside the container now)</span>
<span class="term-muted">root@${escapeHtml(pod)}:/# ${escapeHtml(shell)}</span></div>`;
        }
    },
    // kubectl exec <pod> -- <cmd> (no -it)
    {
        pattern: /^kubectl exec (\S+)\s+--\s+(.+)$/,
        fn: (m) => `<div class="term-output"><span class="term-muted">Executing "${escapeHtml(m[2])}" in pod ${escapeHtml(m[1])}...</span>
<span class="term-success">Command completed successfully.</span></div>`
    },
    // kubectl delete pod/deploy/svc <name>
    {
        pattern: /^kubectl delete (pod|po|deployment|deploy|service|svc|configmap|cm|secret) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">${m[1]} "${escapeHtml(m[2])}" deleted</span></div>`
    },
    // kubectl delete -f <file>
    {
        pattern: /^kubectl delete -f (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">Resources from "${escapeHtml(m[1])}" deleted</span></div>`
    },
    // kubectl apply -f <file>
    {
        pattern: /^kubectl apply -f (\S+)(\s+--dry-run=\w+)?$/,
        fn: (m) => {
            const dryRun = m[2];
            return `<div class="term-output"><span class="term-success">deployment.apps/myapp ${dryRun ? 'created (dry run)' : 'created'}</span>
<span class="term-success">service/myapp-svc ${dryRun ? 'created (dry run)' : 'created'}</span>
${dryRun ? '<span class="term-info">(Dry run — no resources were actually created)</span>' : ''}</div>`;
        }
    },
    // kubectl scale deployment <name> --replicas=N
    {
        pattern: /^kubectl scale (deployment|deploy|statefulset|sts) (\S+) --replicas=(\d+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">${m[1]}.apps "${escapeHtml(m[2])}" scaled to ${m[3]} replicas</span>
<span class="term-info">Waiting for rollout... use "kubectl rollout status deployment/${escapeHtml(m[2])}" to watch</span></div>`
    },
    // kubectl set image deployment/<name> <container>=<image>
    {
        pattern: /^kubectl set image (deployment\/\S+|\S+) (.+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">deployment.apps/${escapeHtml(m[1].replace('deployment/', ''))} image updated</span></div>`
    },
    // kubectl rollout undo deployment/<name>
    {
        pattern: /^kubectl rollout undo (deployment\/\S+|\S+)(\s+--to-revision=\d+)?$/,
        fn: (m) => `<div class="term-output"><span class="term-success">deployment.apps/${escapeHtml(m[1].replace('deployment/', ''))} rolled back</span></div>`
    },
    // kubectl rollout pause/resume deployment/<name>
    {
        pattern: /^kubectl rollout (pause|resume) (deployment\/\S+|\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">deployment.apps/${escapeHtml(m[2].replace('deployment/', ''))} ${m[1]}d</span></div>`
    },
    // kubectl rollout status deployment/<name>
    {
        pattern: /^kubectl rollout status (deployment\/\S+|\S+)$/,
        fn: (m) => TERMINAL_DB['kubectl rollout status deployment/myapp']()
    },
    // kubectl rollout history deployment/<name>
    {
        pattern: /^kubectl rollout history (deployment\/\S+|\S+)$/,
        fn: (m) => TERMINAL_DB['kubectl rollout history deployment/myapp']()
    },
    // kubectl top pod <name>
    {
        pattern: /^kubectl top (pod|po) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-header">NAME        CPU(cores)   MEMORY(bytes)</span>
<span class="term-row"><span class="col name">${escapeHtml(m[2])}</span> <span class="col status-ok">45m</span> <span class="col muted">92Mi</span></span></div>`
    },
    // kubectl top pods
    {
        pattern: /^kubectl top (pods|po)$/,
        fn: () => `<div class="term-output"><span class="term-header">NAME                              CPU(cores)   MEMORY(bytes)</span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84-xk2p9</span>  <span class="col status-ok">12m</span>   <span class="col muted">64Mi</span></span>
<span class="term-row"><span class="col name">backend-api-5f4d9d7c8-r4k7p</span>  <span class="col status-ok">45m</span>   <span class="col muted">128Mi</span></span>
<span class="term-row"><span class="col name">redis-0</span>                       <span class="col status-ok">8m</span>    <span class="col muted">32Mi</span></span>
<span class="term-row"><span class="col name">postgres-0</span>                    <span class="col muted">120m</span>  <span class="col status-bad">512Mi</span></span>
<span class="term-row"><span class="col name">debug-pod</span>                     <span class="col status-bad">0m</span>    <span class="col muted">0Mi</span></span></div>`
    },
    // kubectl port-forward <name> <port>:<port>
    {
        pattern: /^kubectl port-forward (svc\/|pod\/)?(\S+) (\d+):(\d+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">Forwarding from 127.0.0.1:${m[3]} -> ${m[4]}</span>
<span class="term-success">Forwarding from [::1]:${m[3]} -> ${m[4]}</span>
<span class="term-info">Open http://localhost:${m[3]} in your browser</span>
<span class="term-muted">(Press Ctrl+C to stop forwarding)</span></div>`
    },
    // kubectl expose deployment <name> --port=N --type=X
    {
        pattern: /^kubectl expose (deployment|deploy|pod|po) (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">service/${escapeHtml(m[2])} exposed</span></div>`
    },
    // kubectl create deployment <name> --image=<img>
    {
        pattern: /^kubectl create deployment (\S+) --image=(\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">deployment.apps/${escapeHtml(m[1])} created</span></div>`
    },
    // kubectl run <name> --image=<img>
    {
        pattern: /^kubectl run (\S+) --image=(\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">pod/${escapeHtml(m[1])} created</span></div>`
    },
    // kubectl create secret generic <name> --from-literal=...
    {
        pattern: /^kubectl create secret (\S+) (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">secret/${escapeHtml(m[2])} created</span></div>`
    },
    // kubectl create configmap <name> ...
    {
        pattern: /^kubectl create configmap (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">configmap/${escapeHtml(m[1])} created</span></div>`
    },
    // kubectl create rolebinding <name> ...
    {
        pattern: /^kubectl create rolebinding (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">rolebinding.rbac.authorization.k8s.io/${escapeHtml(m[1])} created</span></div>`
    },
    // kubectl auth can-i <verb> <resource> [--as=user]
    {
        pattern: /^kubectl auth can-i (\S+) (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">yes</span></div>`
    },
    // kubectl get roles / clusterroles / rolebindings / serviceaccounts
    {
        pattern: /^kubectl get (roles?|clusterroles?|rolebindings?|clusterrolebindings?|serviceaccounts?|sa)(\s+.*)?$/,
        fn: (m) => {
            const res = m[1];
            return `<div class="term-output"><span class="term-header">NAME                   AGE</span>
<span class="term-row"><span class="col name">${res.replace(/s$/, '')}-admin</span>    <span class="col muted">42d</span></span>
<span class="term-row"><span class="col name">${res.replace(/s$/, '')}-dev</span>      <span class="col muted">30d</span></span>
<span class="term-row"><span class="col name">${res.replace(/s$/, '')}-readonly</span> <span class="col muted">15d</span></span></div>`;
        }
    },
    // kubectl get endpoints
    {
        pattern: /^kubectl get (endpoints?|ep)(\s+.*)?$/,
        fn: () => `<div class="term-output"><span class="term-header">NAME           ENDPOINTS                          AGE</span>
<span class="term-row"><span class="col name">kubernetes</span>     <span class="col muted">192.168.49.2:8443</span>                 <span class="col muted">42d</span></span>
<span class="term-row"><span class="col name">nginx-svc</span>      <span class="col muted">10.244.1.10:80,10.244.2.8:80</span>     <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">backend-svc</span>    <span class="col muted">10.244.2.8:8080</span>                   <span class="col muted">5d</span></span></div>`
    },
    // kubectl get replicasets/rs
    {
        pattern: /^kubectl get (replicasets?|rs)(\s+.*)?$/,
        fn: () => `<div class="term-output"><span class="term-header">NAME                        DESIRED   CURRENT   READY   AGE</span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84</span>       <span class="col muted">3</span>         <span class="col muted">3</span>         <span class="col status-ok">3</span>       <span class="col muted">10d</span></span>
<span class="term-row"><span class="col name">backend-api-5f4d9d7c8</span>       <span class="col muted">2</span>         <span class="col muted">2</span>         <span class="col status-ok">2</span>       <span class="col muted">5d</span></span></div>`
    },
    // kubectl get hpa
    {
        pattern: /^kubectl get hpa(\s+.*)?$/,
        fn: () => `<div class="term-output"><span class="term-header">NAME           REFERENCE             TARGETS   MINPODS   MAXPODS   REPLICAS   AGE</span>
<span class="term-row"><span class="col name">nginx-hpa</span>      <span class="col muted">Deployment/nginx-deploy</span>   <span class="col status-ok">22%/80%</span>   <span class="col muted">2</span>         <span class="col muted">10</span>        <span class="col muted">3</span>          <span class="col muted">5d</span></span></div>`
    },
    // kubectl get ingress/ing
    {
        pattern: /^kubectl get (ingress|ing)(\s+.*)?$/,
        fn: () => `<div class="term-output"><span class="term-header">NAME           CLASS   HOSTS              ADDRESS         PORT(S)   AGE</span>
<span class="term-row"><span class="col name">main-ingress</span>   <span class="col muted">nginx</span>   <span class="col highlight">app.example.com</span>    <span class="col muted">35.232.10.5</span>     <span class="col muted">80,443</span>    <span class="col muted">20d</span></span></div>`
    },
    // kubectl cordon <node>
    {
        pattern: /^kubectl cordon (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">node/${escapeHtml(m[1])} cordoned</span></div>`
    },
    // kubectl uncordon <node>
    {
        pattern: /^kubectl uncordon (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">node/${escapeHtml(m[1])} uncordoned</span></div>`
    },
    // kubectl drain <node>
    {
        pattern: /^kubectl drain (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-info">node/${escapeHtml(m[1])} already cordoned</span>
<span class="term-success">evicting pod default/nginx-deploy-7d6d9f84-xk2p9</span>
<span class="term-success">evicting pod default/backend-api-5f4d9d7c8-r4k7p</span>
<span class="term-success">node/${escapeHtml(m[1])} drained</span></div>`
    },
    // kubectl taint node <node> <key>=<val>:<effect>
    {
        pattern: /^kubectl taint node (\S+) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">node/${escapeHtml(m[1])} tainted</span></div>`
    },
    // kubectl label pod/node <name> <key>=<val>
    {
        pattern: /^kubectl label (pod|node|deployment) (\S+) (\S+=\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">${m[1]}/${escapeHtml(m[2])} labeled</span></div>`
    },
    // kubectl annotate
    {
        pattern: /^kubectl annotate (\S+) (\S+) (.+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">${m[1]}/${escapeHtml(m[2])} annotated</span></div>`
    },
    // kubectl autoscale deployment <name> ...
    {
        pattern: /^kubectl autoscale (deployment|deploy) (\S+)(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">horizontalpodautoscaler.autoscaling/${escapeHtml(m[2])} autoscaled</span></div>`
    },
    // kubectl get all
    {
        pattern: /^kubectl get all(\s+.*)?$/,
        fn: () => `<div class="term-output"><span class="term-header">NAME                                       READY   STATUS</span>
<span class="term-row"><span class="col name">pod/nginx-deploy-7d6d9f84-xk2p9</span>           <span class="col muted">1/1</span>     <span class="col status-ok">Running</span></span>
<span class="term-row"><span class="col name">pod/debug-pod</span>                              <span class="col muted">0/1</span>     <span class="col status-bad">CrashLoopBackOff</span></span>
<span class="term-header">NAME                   TYPE          CLUSTER-IP</span>
<span class="term-row"><span class="col name">service/kubernetes</span>     <span class="col muted">ClusterIP</span>     <span class="col muted">10.96.0.1</span></span>
<span class="term-row"><span class="col name">service/nginx-svc</span>      <span class="col muted">LoadBalancer</span>  <span class="col muted">10.100.200.1</span></span>
<span class="term-header">NAME                           READY   UP-TO-DATE</span>
<span class="term-row"><span class="col name">deployment.apps/nginx-deploy</span>   <span class="col status-ok">3/3</span>     <span class="col muted">3</span></span></div>`
    },
    // kubectl get pods --all-namespaces / -A
    {
        pattern: /^kubectl get (pods?|po) (-A|--all-namespaces)(\s+.*)?$/,
        fn: () => `<div class="term-output"><span class="term-header">NAMESPACE      NAME                              READY   STATUS    RESTARTS</span>
<span class="term-row"><span class="col name">default</span>        <span class="col muted">nginx-deploy-7d6d9f84-xk2p9</span>      <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span></span>
<span class="term-row"><span class="col name">default</span>        <span class="col muted">debug-pod</span>                         <span class="col muted">0/1</span>     <span class="col status-bad">CrashLoopBackOff</span> <span class="col status-bad">5</span></span>
<span class="term-row"><span class="col name">kube-system</span>    <span class="col muted">coredns-787d4945fb-mxk5r</span>          <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span></span>
<span class="term-row"><span class="col name">kube-system</span>    <span class="col muted">kube-proxy-xfw4t</span>                  <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span></span>
<span class="term-row"><span class="col name">monitoring</span>     <span class="col muted">prometheus-0</span>                       <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span></span></div>`
    },
    // kubectl config view/get-contexts/current-context
    {
        pattern: /^kubectl config (view|get-contexts|current-context|use-context\s+\S+|set-context.*)$/,
        fn: (m) => {
            const sub = m[1].split(' ')[0];
            if (sub === 'current-context') return `<div class="term-output"><span class="term-highlight">playground-cluster</span></div>`;
            if (sub === 'get-contexts') return `<div class="term-output"><span class="term-header">CURRENT   NAME                 CLUSTER              AUTHINFO</span>
<span class="term-row"><span class="col status-ok">*</span>         <span class="col name">playground-cluster</span>   <span class="col muted">playground-cluster</span>   <span class="col muted">k8s-user</span></span>
<span class="term-row"><span class="col muted"> </span>         <span class="col name">staging-cluster</span>      <span class="col muted">staging-cluster</span>      <span class="col muted">k8s-user</span></span></div>`;
            if (sub === 'use-context') return `<div class="term-output"><span class="term-success">Switched to context "${escapeHtml(m[1].replace('use-context ', ''))}".</span></div>`;
            return `<div class="term-output"><span class="term-success">Updated kubeconfig.</span></div>`;
        }
    },
    // kubectl get events --sort-by=...
    {
        pattern: /^kubectl get events(.*)$/,
        fn: () => TERMINAL_DB['kubectl get events']()
    },
    // kubectl get pods -l <selector>
    {
        pattern: /^kubectl get (pods?|po) -l (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-header">NAME                              READY   STATUS    RESTARTS   AGE</span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84-xk2p9</span>      <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span>          <span class="col muted">2d</span></span>
<span class="term-row"><span class="col name">nginx-deploy-7d6d9f84-m92qs</span>      <span class="col muted">1/1</span>     <span class="col status-ok">Running</span>   <span class="col muted">0</span>          <span class="col muted">2d</span></span></div>`
    },
    // kubectl get pods -o jsonpath=...
    {
        pattern: /^kubectl get (pods?|po) -o jsonpath=(.+)$/,
        fn: (m) => `<div class="term-output"><span class="term-highlight">nginx-deploy-7d6d9f84-xk2p9 nginx-deploy-7d6d9f84-m92qs backend-api-5f4d9d7c8-r4k7p redis-0 postgres-0 debug-pod</span></div>`
    },
    // kubectl cp <pod>:/path ./local
    {
        pattern: /^kubectl cp (\S+):(\S+) (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">Copied ${escapeHtml(m[2])} from pod ${escapeHtml(m[1])} -> ${escapeHtml(m[3])}</span></div>`
    },
    // kubectl get namespace <name>  / describe namespace <name>
    {
        pattern: /^kubectl (get|describe) namespace (\S+)$/,
        fn: (m) => `<div class="term-output"><span class="term-header">Name: ${escapeHtml(m[2])}</span>
<span class="term-success">Status: Active</span>
<span class="term-muted">Age: 30d</span></div>`
    },
    // kubectl debug -it <pod> --image=<img> --copy-to=<name>
    {
        pattern: /^kubectl debug(.*)$/,
        fn: (m) => `<div class="term-output"><span class="term-success">Defaulting debug container name to debugger-abc12</span>
<span class="term-success">If you don't see a command prompt, try pressing enter.</span>
<span class="term-info">(Debug container created — in a real cluster you'd have an interactive shell here)</span></div>`
    },
    // kubectl version
    {
        pattern: /^kubectl version(.*)$/,
        fn: () => `<div class="term-output"><span class="term-header">Client Version: v1.28.2</span>
<span class="term-success">Server Version: v1.28.0</span>
<span class="term-muted">Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3</span></div>`
    },
];

function resolvePattern(cmd) {
    if (cmd.startsWith('kubectl ') || cmd === 'kubectl') {
        for (const entry of TERMINAL_PATTERNS) {
            const m = cmd.match(entry.pattern);
            if (m) return entry.fn(m, cmd);
        }
        // Generic fallback for any unrecognized kubectl command
        const parts = cmd.split(' ');
        const verb = parts[1] || '';
        const resource = parts[2] || '';
        return `<div class="term-output term-error">error: unknown command "${escapeHtml(verb)} ${escapeHtml(resource)}"
<span class="term-info">Run "kubectl --help" or type "help" for supported commands.</span></div>`;
    }
    return `<div class="term-output term-error">command not found: ${escapeHtml(cmd)}
<span class="term-info">Use kubectl commands. Type "help" for a list.</span></div>`;
}

const TERM_SUGGESTIONS = [
    'kubectl get pods', 'kubectl get pods -o wide', 'kubectl get nodes',
    'kubectl get services', 'kubectl get deployments', 'kubectl get namespaces',
    'kubectl get configmaps', 'kubectl get secrets', 'kubectl get pv', 'kubectl get pvc',
    'kubectl top nodes', 'kubectl top pods', 'kubectl cluster-info', 'kubectl get events',
    'kubectl describe pod debug-pod', 'kubectl logs debug-pod',
    'kubectl logs nginx-deploy-7d6d9f84-xk2p9',
    'kubectl exec -it nginx-deploy-7d6d9f84-xk2p9 -- /bin/bash',
    'kubectl rollout status deployment/nginx-deploy',
    'kubectl rollout history deployment/nginx-deploy',
    'kubectl rollout undo deployment/nginx-deploy',
    'kubectl scale deployment nginx-deploy --replicas=5',
    'kubectl get pod debug-pod -o yaml', 'kubectl describe node playground-node1',
    'kubectl port-forward svc/nginx-svc 8080:80', 'kubectl auth can-i create pods',
    'kubectl get hpa', 'kubectl get ingress', 'kubectl drain playground-node1 --ignore-daemonsets',
    'kubectl get storageclass', 'kubectl version', 'help', 'tutorial',
];

let termHistory = [];
let histIdx = -1;

function initTerminal() {
    const input = $('terminal-input');
    const body = $('terminal-body');
    const sugBox = $('terminal-suggestions');

    function runCommand(cmd) {
        cmd = cmd.trim();
        if (!cmd) return;
        termHistory.unshift(cmd);
        histIdx = -1;

        // Echo input
        const echoEl = document.createElement('div');
        echoEl.className = 'term-output';
        echoEl.innerHTML = `<span class="term-user">k8s-user</span><span style="color:var(--text-dim)">@</span><span class="term-cluster">playground</span><span style="color:var(--text-dim)">:~$</span> <span class="term-cmd-echo">${escapeHtml(cmd)}</span>`;
        body.appendChild(echoEl);

        const normalized = cmd.replace(/\s+/g, ' ').trim();
        let output = '';

        if (TERMINAL_DB[normalized]) {
            output = TERMINAL_DB[normalized]();
        } else if (normalized === 'clear') {
            body.innerHTML = '';
            input.value = '';
            sugBox.innerHTML = '';
            return;
        } else {
            output = resolvePattern(normalized);
        }

        const outEl = document.createElement('div');
        outEl.innerHTML = output;
        body.appendChild(outEl);
        body.scrollTop = body.scrollHeight;
        input.value = '';
        sugBox.innerHTML = '';
    }

    $('run-cmd').addEventListener('click', () => runCommand(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { runCommand(input.value); return; }
        if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx < termHistory.length - 1) { histIdx++; input.value = termHistory[histIdx]; } }
        if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > 0) { histIdx--; input.value = termHistory[histIdx]; } else { histIdx = -1; input.value = ''; } }
        if (e.key === 'Tab') {
            e.preventDefault();
            const val = input.value.toLowerCase();
            const match = TERM_SUGGESTIONS.find(s => s.toLowerCase().startsWith(val) && s !== val);
            if (match) input.value = match;
        }
    });

    input.addEventListener('input', () => {
        const val = input.value.toLowerCase();
        if (!val) { sugBox.innerHTML = ''; return; }
        const matches = TERM_SUGGESTIONS.filter(s => s.toLowerCase().includes(val) && s !== val).slice(0, 5);
        sugBox.innerHTML = matches.map(m => `<button class="suggestion-chip" data-cmd="${m}">${m}</button>`).join('');
        sugBox.querySelectorAll('.suggestion-chip').forEach(btn => {
            btn.addEventListener('click', () => { input.value = btn.dataset.cmd; sugBox.innerHTML = ''; input.focus(); });
        });
    });

    $('clear-terminal').addEventListener('click', () => { body.innerHTML = ''; });
    $('copy-terminal').addEventListener('click', () => { navigator.clipboard.writeText(body.innerText); toast('Terminal output copied!', 'success'); });

    document.querySelectorAll('.quick-cmd').forEach(btn => {
        btn.addEventListener('click', () => { input.value = btn.dataset.cmd; runCommand(btn.dataset.cmd); });
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- COMMANDS SECTION ----
function initCommands() {
    const grid = $('commands-grid');
    const searchInput = $('cmd-search');
    const searchClear = $('cmd-search-clear');
    const noResults = $('no-results');

    let activeCategory = 'all';
    let searchQuery = '';

    function renderCommands() {
        let filtered = COMMANDS;
        if (activeCategory !== 'all') filtered = filtered.filter(c => c.category === activeCategory);
        if (searchQuery) filtered = filtered.filter(c =>
            c.cmd.toLowerCase().includes(searchQuery) ||
            c.title.toLowerCase().includes(searchQuery) ||
            c.desc.toLowerCase().includes(searchQuery)
        );

        noResults.style.display = filtered.length === 0 ? 'flex' : 'none';
        $('no-results-query').textContent = searchQuery;

        grid.innerHTML = filtered.map(c => `
      <div class="cmd-card" data-cmd="${escapeHtml(c.cmd)}">
        <div class="cmd-card-header">
          <span class="cmd-badge ${c.category}">${c.category}</span>
          <button class="cmd-copy-btn" data-cmd="${escapeHtml(c.cmd)}" title="Copy command">📋 Copy</button>
        </div>
        <div class="cmd-title">${escapeHtml(c.title)}</div>
        <div class="cmd-code">${escapeHtml(c.cmd)}</div>
        <div class="cmd-desc">${escapeHtml(c.desc)}</div>
        <button class="cmd-try-btn" data-cmd="${escapeHtml(c.cmd)}">▶ Try in Terminal</button>
      </div>
    `).join('');

        grid.querySelectorAll('.cmd-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(btn.dataset.cmd);
                toast('Command copied!', 'success');
            });
        });

        grid.querySelectorAll('.cmd-try-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $('terminal-input').value = btn.dataset.cmd;
                document.getElementById('terminal').scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => $('terminal-input').focus(), 600);
            });
        });
    }

    document.querySelectorAll('#category-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            renderCommands();
        });
    });

    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.toLowerCase().trim();
        searchClear.style.display = searchQuery ? 'block' : 'none';
        renderCommands();
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.style.display = 'none';
        renderCommands();
    });

    renderCommands();
}

// ---- ARCHITECTURE ----
function initArchitecture() {
    const panel = $('arch-info-panel');
    document.querySelectorAll('[data-comp]').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('[data-comp]').forEach(e => e.classList.remove('active'));
            el.classList.add('active');
            const info = ARCH_INFO[el.dataset.comp];
            if (!info) return;
            panel.innerHTML = `
        <div class="arch-info-content">
          <div class="arch-info-icon">${info.icon}</div>
          <div class="arch-info-name">${info.name}</div>
          <div class="arch-info-desc">${info.desc}</div>
          <div class="arch-info-tags">${info.tags.map(t => `<span class="arch-info-tag">${t}</span>`).join('')}</div>
        </div>`;
        });
    });
}

// ---- QUIZ ----
let quizState = {};

function initQuiz() {
    const startBtn = $('start-quiz');
    const diffBtns = document.querySelectorAll('.diff-btn');
    let selectedDiff = 'beginner';

    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            diffBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDiff = btn.dataset.diff;
        });
    });

    const saved = JSON.parse(localStorage.getItem('k8s_best') || '{}');
    if (saved.score !== undefined) {
        $('quiz-best-score').textContent = `🏆 Best score: ${saved.score}% (${saved.diff} mode)`;
    }

    startBtn.addEventListener('click', () => {
        const count = parseInt($('quiz-count').value);
        let pool = selectedDiff === 'all' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.diff === selectedDiff);
        if (pool.length === 0) { toast('No questions for this difficulty!', 'error'); return; }
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));
        quizState = { questions: shuffled, current: 0, score: 0, wrong: 0, skipped: 0, diff: selectedDiff, answers: [] };
        $('quiz-start').style.display = 'none';
        $('quiz-active').style.display = 'block';
        renderQuestion();
    });

    $('quiz-retry').addEventListener('click', () => {
        $('quiz-results').style.display = 'none';
        $('quiz-start').style.display = 'block';
    });

    $('quiz-review').addEventListener('click', () => {
        $('quiz-results').style.display = 'none';
        $('quiz-start').style.display = 'block';
        toast('Review your performance in the Interview section!', 'info');
    });
}

let quizTimer;
function renderQuestion() {
    clearInterval(quizTimer);
    const { questions, current } = quizState;
    if (current >= questions.length) { showQuizResults(); return; }
    const q = questions[current];
    const total = questions.length;

    $('quiz-progress-fill').style.width = `${(current / total) * 100}%`;
    $('quiz-qnum').textContent = `Question ${current + 1}/${total}`;
    $('quiz-score-live').textContent = `Score: ${quizState.score}`;
    $('quiz-diff-badge').textContent = q.diff.charAt(0).toUpperCase() + q.diff.slice(1);
    $('quiz-diff-badge').className = `quiz-diff-badge ${q.diff}`;
    $('quiz-question-text').textContent = q.q;
    $('quiz-explanation').style.display = 'none';
    $('quiz-next').style.display = 'none';
    $('quiz-skip').style.display = 'inline-flex';

    const letters = ['A', 'B', 'C', 'D'];
    $('quiz-options').innerHTML = q.opts.map((o, i) => `
    <div class="quiz-option" data-idx="${i}">
      <span class="option-letter">${letters[i]}</span>
      <span>${o}</span>
    </div>`).join('');

    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('click', () => selectAnswer(parseInt(opt.dataset.idx)));
    });

    // Timer
    let secs = 30;
    const timerEl = $('quiz-timer');
    timerEl.textContent = `⏱ ${secs}s`;
    timerEl.classList.remove('urgent');
    quizTimer = setInterval(() => {
        secs--;
        timerEl.textContent = `⏱ ${secs}s`;
        if (secs <= 10) timerEl.classList.add('urgent');
        if (secs <= 0) { clearInterval(quizTimer); skipQuestion(); }
    }, 1000);

    $('quiz-skip').onclick = skipQuestion;
    $('quiz-next').onclick = () => { quizState.current++; renderQuestion(); };
}

function selectAnswer(idx) {
    clearInterval(quizTimer);
    const q = quizState.questions[quizState.current];
    const opts = document.querySelectorAll('.quiz-option');
    opts.forEach(o => o.classList.add('disabled'));

    const isCorrect = idx === q.ans;
    opts[idx].classList.add('selected', isCorrect ? 'correct' : 'incorrect');
    if (!isCorrect) opts[q.ans].classList.add('correct-ans');

    isCorrect ? quizState.score++ : quizState.wrong++;
    quizState.answers.push({ q: q.q, correct: isCorrect });

    $('quiz-explanation').style.display = 'block';
    $('quiz-explanation').innerHTML = `<strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</strong> ${q.exp}`;
    $('quiz-next').style.display = 'inline-flex';
    $('quiz-skip').style.display = 'none';
    $('quiz-score-live').textContent = `Score: ${quizState.score}`;
}

function skipQuestion() {
    clearInterval(quizTimer);
    quizState.skipped++;
    quizState.current++;
    renderQuestion();
}

function showQuizResults() {
    $('quiz-active').style.display = 'none';
    $('quiz-results').style.display = 'block';
    const total = quizState.questions.length;
    const pct = Math.round((quizState.score / total) * 100);

    $('result-percent').textContent = pct + '%';
    $('res-correct').textContent = quizState.score;
    $('res-wrong').textContent = quizState.wrong;
    $('res-skipped').textContent = quizState.skipped;
    $('ring-progress').style.strokeDashoffset = 314 - (314 * pct / 100);

    let emoji, title, msg;
    if (pct >= 90) { emoji = '🏆'; title = 'Outstanding!'; msg = 'You\'re a Kubernetes expert. Ready for senior SRE roles!'; }
    else if (pct >= 70) { emoji = '🎉'; title = 'Great Job!'; msg = 'Solid knowledge base. Review the tricky ones and you\'ll ace any interview.'; }
    else if (pct >= 50) { emoji = '💪'; title = 'Good Effort!'; msg = 'Decent foundation. Focus on the interview section to fill gaps.'; }
    else { emoji = '📚'; title = 'Keep Learning!'; msg = 'Review the commands and interview Q&A sections to strengthen your knowledge.'; }

    $('result-emoji').textContent = emoji;
    $('result-title').textContent = title;
    $('result-message').textContent = msg;

    const best = JSON.parse(localStorage.getItem('k8s_best') || '{}');
    if (!best.score || pct > best.score) {
        localStorage.setItem('k8s_best', JSON.stringify({ score: pct, diff: quizState.diff }));
        $('quiz-best-score').textContent = `🏆 Best score: ${pct}% (${quizState.diff} mode)`;
    }
    updateProgress();
}

// ---- INTERVIEW ----
let fcIdx = 0;
let filteredQA = [];

function initInterview() {
    filteredQA = [...INTERVIEW_QA];
    renderAccordion(filteredQA);

    document.querySelectorAll('#interview-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#interview-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.icat;
            filteredQA = cat === 'all' ? [...INTERVIEW_QA] : INTERVIEW_QA.filter(q => q.cat === cat);
            applyInterviewSearch(filteredQA);
        });
    });

    $('interview-search').addEventListener('input', () => {
        applyInterviewSearch(filteredQA);
    });

    $('view-accordion').addEventListener('click', () => {
        $('view-accordion').classList.add('active');
        $('view-flashcard').classList.remove('active');
        $('interview-accordion').style.display = 'flex';
        $('interview-flashcard').style.display = 'none';
    });

    $('view-flashcard').addEventListener('click', () => {
        $('view-flashcard').classList.add('active');
        $('view-accordion').classList.remove('active');
        $('interview-accordion').style.display = 'none';
        $('interview-flashcard').style.display = 'block';
        fcIdx = 0;
        renderFlashcard();
    });

    $('fc-prev').addEventListener('click', () => { if (fcIdx > 0) { fcIdx--; renderFlashcard(); } });
    $('fc-next').addEventListener('click', () => { if (fcIdx < filteredQA.length - 1) { fcIdx++; renderFlashcard(); } });

    document.getElementById('flashcard').addEventListener('click', () => {
        document.getElementById('flashcard').classList.toggle('flipped');
    });

    document.querySelectorAll('.fc-rate').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ratings = JSON.parse(localStorage.getItem('k8s_ratings') || '{}');
            ratings[fcIdx] = btn.dataset.rating;
            localStorage.setItem('k8s_ratings', JSON.stringify(ratings));
            toast(`Marked as ${btn.dataset.rating}`, 'success');
            if (fcIdx < filteredQA.length - 1) { fcIdx++; renderFlashcard(); }
        });
    });
}

function applyInterviewSearch(base) {
    const q = $('interview-search').value.toLowerCase();
    const result = q ? base.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) : base;
    renderAccordion(result);
}

function renderAccordion(items) {
    const container = document.getElementById('interview-accordion');
    container.innerHTML = items.map((item, i) => `
    <div class="qa-card" id="qa-${i}">
      <div class="qa-question" data-idx="${i}">
        <div class="qa-num">${i + 1}</div>
        <div class="qa-text">${escapeHtml(item.q)}</div>
        <div class="qa-meta">
          <span class="qa-level ${item.level}">${item.level}</span>
          <span class="qa-cat-badge">${item.cat}</span>
        </div>
        <span class="qa-toggle">▼</span>
      </div>
      <div class="qa-answer">
        <div class="qa-answer-inner">${item.a}</div>
      </div>
    </div>`).join('');

    container.querySelectorAll('.qa-question').forEach(el => {
        el.addEventListener('click', () => {
            const card = el.closest('.qa-card');
            const isOpen = card.classList.contains('open');
            container.querySelectorAll('.qa-card').forEach(c => c.classList.remove('open'));
            if (!isOpen) card.classList.add('open');
        });
    });
}

function renderFlashcard() {
    const item = filteredQA[fcIdx];
    if (!item) return;
    $('fc-counter').textContent = `${fcIdx + 1} / ${filteredQA.length}`;
    $('fc-badge').innerHTML = `<span class="qa-level ${item.level}">${item.level}</span>`;
    $('fc-question').textContent = item.q;
    $('fc-answer').innerHTML = item.a;
    document.getElementById('flashcard').classList.remove('flipped');
}

// ---- PROGRESS ----
function updateProgress() {
    const best = JSON.parse(localStorage.getItem('k8s_best') || '{}');
    const pct = best.score || 0;
    $('progress-text').textContent = `${pct}% Complete`;
    $('progress-icon').textContent = pct >= 80 ? '🏆' : pct >= 50 ? '🎯' : '📚';
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNav();
    initTerminal();
    initCommands();
    initArchitecture();
    initQuiz();
    initInterview();
    updateProgress();

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
});
