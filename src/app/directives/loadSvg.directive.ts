import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[loadSvg]',
  standalone: true,
})
export class LoadSvgDirective implements OnChanges {
  @Input() icon!: string | undefined;
  @Input() text: string | undefined;
  constructor(private elementRef: ElementRef, private render: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    const parser = new DOMParser();
    const angularId = this.elementRef.nativeElement.attributes[0];

    this.elementRef.nativeElement.innerHTML = '';
    this.parseIconSvg(parser, angularId);
    this.parseTextSvg(parser, angularId);
  }

  parseTextSvg(parser: DOMParser, angularId: any) {
    if (!this.text) return;
    const container = this.render.createElement('span');
    this.render.appendChild(this.elementRef.nativeElement, container);
    container.style.display = 'inline';
    const re = /<svg.*?<\/svg>/gms;
    let match;
    let end = 0;
    let svgList: Array<{ svg: string; start: number; end: number }> = [];
    while ((match = re.exec(this.text)) != null) {
      const svg = parser.parseFromString(
        match[0],
        'image/svg+xml'
      ).documentElement;
      svg.setAttribute(angularId.name, angularId);
      svg.style.display = 'inline';

      const prevTextNode = this.render.createText(
        this.text.substring(end, match.index)
      );
      this.render.appendChild(container, prevTextNode);
      this.render.appendChild(container, svg);
      end = match.index + match[0].length;
    }
    const endText = this.render.createText(this.text.substring(end));
    this.render.appendChild(container, endText);
  }

  parseIconSvg(parser: DOMParser, angularId: any) {
    if (!this.icon) return;
    const svg = parser.parseFromString(
      this.icon,
      'image/svg+xml'
    ).documentElement;
    svg.setAttribute(angularId.name, angularId);
    svg.classList.add('icon');
    this.render.appendChild(this.elementRef.nativeElement, svg);
  }
}
