
(function(){

  const canvas = document.querySelector("canvas");
  const inputContainer = document.querySelector(".input");

  resizeCanvas() && window.addEventListener("resize", resizeCanvas);
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentNode.offsetHeight - inputContainer.offsetHeight;
    return true;
  }

  const graph = new Springy.Graph();
  $("canvas").springy({graph});

  let currentSubject;
  let isLinking = false;
  const submit = {
    subject: function(e){
      const label = e.target.value;
      if(label.replace(/\s/g, "") !== ""){
        if(e.key === "Enter"){
          nodeInput.focus();
        }else{
          if(currentSubject){
            currentSubject.data.label = label;
          }else{
            currentSubject = graph.newNode({label, onNodeClick, ondoubleclick});
          }
        }
      }
    },
    node: function(e){
      const label = e.target.value;
      if(e.key === "Enter" && currentSubject && label.replace(/\s/g, "") !== ""){
        const newNode = graph.newNode({label, onNodeClick, ondoubleclick});
        graph.newEdge(currentSubject, newNode);
        e.target.value = "";
      }
    },
    link: function(){
      linkButton.classList.toggle("active");
      isLinking = !isLinking;
    }
  }

  function onNodeClick(node){
    if(isLinking && currentSubject){
      graph.newEdge(currentSubject, node);
      submit.link();
    }
    currentSubject = node;
    subjectInput.value = node.data.label;
    nodeInput.focus();
  }

  function ondoubleclick(node){
    graph.removeNode(node);
    currentSubject = null;
    subjectInput.value = "";
    subjectInput.focus();
  }

  const subjectInput = document.querySelector("#input-subject");
  const nodeInput = document.querySelector("#input-node");
  const linkButton = document.querySelector("#button-link");
  subjectInput.addEventListener("keyup", submit.subject);
  nodeInput.addEventListener("keyup", submit.node);
  linkButton.addEventListener("click", submit.link);
  subjectInput.focus();

  document.querySelector(".usage__text--hide")
    .addEventListener("click", e => {
      e.target.parentNode.remove();
    })
  ;

})();
