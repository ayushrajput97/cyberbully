# train/train.py (outline)
from transformers import AutoModelForSequenceClassification, TrainingArguments, Trainer
from datasets import load_from_disk

model = AutoModelForSequenceClassification.from_pretrained("unitary/toxic-bert", num_labels=2)
train_dataset = load_from_disk("data/train")
eval_dataset = load_from_disk("data/val")

training_args = TrainingArguments(
    output_dir="saved_models/toxicbert",
    per_device_train_batch_size=16,
    evaluation_strategy="steps",
    eval_steps=500,
    save_steps=1000,
    num_train_epochs=3,
    logging_steps=100,
    fp16=True
)

def compute_metrics(pred):
    from sklearn.metrics import accuracy_score, precision_recall_fscore_support
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    p, r, f1, _ = precision_recall_fscore_support(labels, preds, average='binary')
    return {"accuracy": accuracy_score(labels, preds), "precision": p, "recall": r, "f1": f1}

trainer = Trainer(model=model, args=training_args,
                  train_dataset=train_dataset, eval_dataset=eval_dataset,
                  compute_metrics=compute_metrics)
trainer.train()
trainer.save_model("saved_models/toxicbert")
