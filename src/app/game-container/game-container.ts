import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'game-container',
  standalone: true,
 imports: [CommonModule, RouterModule],
  template: `
    <div class="scroll-container" #scrollContainer>
      <div class="scroll-content">
        <div class="item" *ngFor="let item of items">
          {{ item }}
        </div>
      </div>
    </div>
  `,
  styleUrl: "./game-container.css"
})
export class GameContainer implements OnInit, OnDestroy {
  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef<HTMLDivElement>;
  
  // Configurable inputs
  @Input() edgeThreshold = 100; // pixels from edge to trigger scroll
  @Input() scrollSpeed = 5; // pixels per frame
  @Input() enableVerticalScroll = false; // set to true for vertical scrolling too
  
  items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);
  
  private scrollInterval: any;
  private isScrolling = false;

  ngOnInit() {
    // Any initialization if needed
  }

  ngOnDestroy() {
    this.stopScrolling();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    // Check horizontal edges
    const nearLeftEdge = mouseX < this.edgeThreshold;
    const nearRightEdge = mouseX > screenWidth - this.edgeThreshold;
    
    // Check vertical edges (if enabled)
    const nearTopEdge = this.enableVerticalScroll && mouseY < this.edgeThreshold;
    const nearBottomEdge = this.enableVerticalScroll && mouseY > screenHeight - this.edgeThreshold;
    
    if (nearLeftEdge || nearRightEdge || nearTopEdge || nearBottomEdge) {
      let direction: 'left' | 'right' | 'up' | 'down';
      
      if (nearLeftEdge) direction = 'left';
      else if (nearRightEdge) direction = 'right';
      else if (nearTopEdge) direction = 'up';
      else direction = 'down';
      
      this.startScrolling(direction);
    } else {
      this.stopScrolling();
    }
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.stopScrolling();
  }

  private startScrolling(direction: 'left' | 'right' | 'up' | 'down') {
    if (this.isScrolling) return;
  
    this.isScrolling = true;
    console.log('scrolling', direction)
    
    this.scrollInterval = setInterval(() => {
      const container = this.scrollContainer.nativeElement;
      
      switch (direction) {
        case 'left':
          container.scrollLeft = Math.max(0, container.scrollLeft - this.scrollSpeed);
          if (container.scrollLeft <= 0) this.stopScrolling();
          break;
        case 'right':
          const maxScroll = container.scrollWidth - container.clientWidth;
          container.scrollLeft = Math.min(maxScroll, container.scrollLeft + this.scrollSpeed);
          if (container.scrollLeft >= maxScroll) this.stopScrolling();
          break;
        case 'up':
          container.scrollTop = Math.max(0, container.scrollTop - this.scrollSpeed);
          if (container.scrollTop <= 0) this.stopScrolling();
          break;
        case 'down':
          const maxVerticalScroll = container.scrollHeight - container.clientHeight;
          container.scrollTop = Math.min(maxVerticalScroll, container.scrollTop + this.scrollSpeed);
          if (container.scrollTop >= maxVerticalScroll) this.stopScrolling();
          break;
      }
    }, 16);
  }

  private stopScrolling() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
    this.isScrolling = false;
  }
}