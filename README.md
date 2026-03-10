# ☸️ K8s Playground

An **interactive Kubernetes learning platform** built with vanilla HTML, CSS, and JavaScript. Practice kubectl commands, explore architecture, take quizzes, and prep for interviews — all in the browser.

🚀 **[Live Demo](https://naman2204.github.io/k8s-playground)** &nbsp;|&nbsp; ⭐ Star if you find it useful!

---

## ✨ Features

| Section | Description |
|---|---|
| 🖥️ **Terminal** | Interactive kubectl simulator with 50+ commands, regex pattern matching, and realistic output |
| 📚 **Commands** | Cheatsheet with 65+ commands across 8 categories (Basics, Pods, Deployments, Services, Config, Storage, RBAC, Debugging) |
| 🎓 **Learn** | Guided learning path with 15+ topics, interactive content, and topic-specific quizzes |
| 🏗️ **Architecture** | Interactive K8s architecture diagram with detailed component cards |
| 🧠 **Quiz** | 22 multiple-choice questions (Beginner / Intermediate / Advanced) with explanations |
| 🎤 **Interview Prep** | 43 production-level interview Q&A with detailed answers and code examples |

---

## 🎤 Interview Topics Covered

- Kubernetes Architecture & Control Loop
- Pods, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs
- Services, Ingress, NetworkPolicy, kube-proxy, CNI
- Persistent Volumes, PVCs, Storage Classes
- RBAC, Secrets, Pod Security Context, Admission Controllers
- HPA, VPA, Cluster Autoscaler, KEDA
- Helm & Helm Hooks
- Operator Pattern & CRDs
- Observability (Prometheus, Grafana, Loki, Jaeger)
- GitOps & Argo CD
- Service Mesh & Istio
- Taints, Tolerations, Affinity, QoS Classes
- Zero-downtime deployments, Blue-Green, Canary
- Troubleshooting (Pending, CrashLoopBackOff, node drain)
- etcd backup & restore, Cluster upgrades

---

## 🚀 Getting Started

```bash
git clone https://github.com/Naman2204/k8s-playground.git
cd k8s-playground

# Serve locally (any of these work)
python -m http.server 8765
# or: npx serve .
# or: open index.html directly in a browser
```

Then open **http://localhost:8765**

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **Vanilla CSS** — Custom design system, glassmorphism, animations
- **Vanilla JavaScript** — All app logic, no frameworks or dependencies

---

## 📁 Project Structure

```
k8s-playground/
├── index.html   # App shell & layout
├── index.css    # Design system & styles
├── app.js       # Terminal simulator, quiz engine, UI logic
└── data.js      # Commands, quiz questions, interview Q&A, arch data
```

---

## 📸 Screenshots

> Terminal, Commands, Architecture, Quiz, Interview tabs

---

## 🤝 Contributing

Pull requests welcome! Feel free to add more commands, quiz questions, or interview topics.

---

## 📄 License

MIT © [Naman2204](https://github.com/Naman2204)
